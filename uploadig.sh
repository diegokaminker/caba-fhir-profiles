#!/bin/bash

# Upload FHIR Resources to FHIR Server
# This script uploads individual FHIR resources from the output folder to the HAPI FHIR server

# Check if parameters are provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <resources_folder> <fhir_server_url>"
    echo "Example: $0 ./output https://fhirserver.hl7fundamentals.org/fhir"
    exit 1
fi

# Configuration
RESOURCES_FOLDER="$1"
FHIR_SERVER_URL="$2"

# Check if the resources directory exists
if [ ! -d "$RESOURCES_FOLDER" ]; then
    echo "Error: Resources directory not found at $RESOURCES_FOLDER"
    echo "Please make sure the directory exists."
    exit 1
fi

# Check if curl is installed
if ! command -v curl &> /dev/null; then
    echo "Error: curl command not found. Please install it first."
    exit 1
fi

echo "Uploading FHIR resources to server..."
echo "Resources folder: $RESOURCES_FOLDER"
echo "Server: $FHIR_SERVER_URL"
echo ""

# Change to the resources directory
cd "$RESOURCES_FOLDER"

# Function to extract resource URL from JSON file
get_resource_url() {
    local file="$1"
    local url=$(grep -o '"url"[[:space:]]*:[[:space:]]*"[^"]*"' "$file" | head -1 | sed 's/.*"url"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
    echo "$url"
}

# Function to extract resource type from JSON file
get_resource_type() {
    local file="$1"
    local resource_type=$(grep -o '"resourceType"[[:space:]]*:[[:space:]]*"[^"]*"' "$file" | head -1 | sed 's/.*"resourceType"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
    echo "$resource_type"
}

# Function to check if resource exists by URL and get its server ID
check_resource_exists() {
    local url="$1"
    local resource_type="$2"
    local server_url="$3"
    
    # Try to get the resource by URL
    local response=$(curl -s -w "%{http_code}" -o /tmp/resource_check.json "$server_url/$resource_type?url=$url")
    local http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        # Resource exists, extract the server-assigned ID from entry.resource.id
        # First try with jq if available
        if command -v jq &> /dev/null; then
            local id=$(jq -r '.entry[0].resource.id' /tmp/resource_check.json 2>/dev/null)
        else
            # Fallback to grep/sed approach
            local id=$(grep -A 20 '"entry"' /tmp/resource_check.json | grep -A 10 '"resource"' | grep '"id"' | head -1 | sed 's/.*"id"[[:space:]]*:[[:space:]]*\([0-9]*\).*/\1/')
        fi
        echo "$id"
    else
        echo ""
    fi
}

# Function to upload resource with conditional logic
upload_resource() {
    local file="$1"
    local server_url="$2"
    
    local resource_url=$(get_resource_url "$file")
    local resource_type=$(get_resource_type "$file")
    
    if [ -z "$resource_url" ] || [ -z "$resource_type" ]; then
        echo "  Warning: Could not extract URL or resource type from $file, skipping..."
        return
    fi
    
    echo "  Processing $file (URL: $resource_url)..."
    
    # Check if resource exists and get its ID
    local existing_id=$(check_resource_exists "$resource_url" "$resource_type" "$server_url")
    
    if [ -n "$existing_id" ]; then
        echo "    Resource exists (ID: $existing_id), updating..."
        # Create a temporary file with the ID properly set
        local temp_file="/tmp/$(basename "$file")"
        # Use jq to properly set the id field
        if command -v jq &> /dev/null; then
            jq --arg id "$existing_id" '.id = $id' "$file" > "$temp_file"
        else
            # Fallback to sed approach
            if grep -q '"id"' "$file"; then
                # Replace existing id
                sed 's/"id"[[:space:]]*:[[:space:]]*"[^"]*"/"id":"'"$existing_id"'"/g' "$file" > "$temp_file"
            else
                # Add id field after resourceType
                sed 's/"resourceType"[[:space:]]*:[[:space:]]*"[^"]*"/"resourceType":"\1","id":"'"$existing_id"'"/' "$file" > "$temp_file"
            fi
        fi
        
        # Update existing resource using PUT with ID
        local response=$(curl -s -w "%{http_code}" -X PUT -d @"$temp_file" "$server_url/$resource_type/$existing_id" -H "Content-Type: application/json")
        local http_code="${response: -3}"
        if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
            echo "    ✓ Successfully updated (PUT with ID)"
        else
            echo "    PUT failed (HTTP $http_code), trying POST..."
            response=$(curl -s -w "%{http_code}" -X POST -d @"$file" "$server_url/$resource_type" -H "Content-Type: application/json")
            http_code="${response: -3}"
            if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
                echo "    ✓ Successfully updated (POST)"
            else
                echo "    ✗ Update failed (HTTP $http_code)"
            fi
        fi
        
        # Clean up temporary file
        rm -f "$temp_file"
    else
        echo "    Resource does not exist, creating..."
        # Create new resource
        local response=$(curl -s -w "%{http_code}" -X POST -d @"$file" "$server_url/$resource_type" -H "Content-Type: application/json")
        local http_code="${response: -3}"
        if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
            echo "    ✓ Successfully created"
        else
            echo "    ✗ Creation failed (HTTP $http_code)"
        fi
    fi
}

# Upload CodeSystems
echo "Uploading CodeSystems..."
for f in CodeSystem*.json; do
    if [ -f "$f" ]; then
        upload_resource "$f" "$FHIR_SERVER_URL"
    fi
done

# Upload ValueSets
echo "Uploading ValueSets..."
for f in ValueSet*.json; do
    if [ -f "$f" ]; then
        upload_resource "$f" "$FHIR_SERVER_URL"
    fi
done

# Upload StructureDefinitions
echo "Uploading StructureDefinitions..."
for f in StructureDefinition*.json; do
    if [ -f "$f" ]; then
        upload_resource "$f" "$FHIR_SERVER_URL"
    fi
done



# Clean up temporary file
rm -f /tmp/resource_check.json

echo ""
echo "Upload completed!" 