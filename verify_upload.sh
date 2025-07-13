#!/bin/bash

# Verify FHIR Resources Upload
# This script verifies that all FHIR resources from the output folder are correctly uploaded to the server

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

echo "Verifying FHIR resources on server..."
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

# Function to check if resource exists on server
check_resource_on_server() {
    local url="$1"
    local resource_type="$2"
    local server_url="$3"
    
    # Try to get the resource by URL
    local response=$(curl -s -w "%{http_code}" -o /tmp/verify_check.json "$server_url/$resource_type?url=$url")
    local http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        echo "✓"
    else
        echo "✗"
    fi
}

# Function to get resource version from server
get_server_version() {
    local url="$1"
    local resource_type="$2"
    local server_url="$3"
    
    # Try to get the resource by URL
    local response=$(curl -s -w "%{http_code}" -o /tmp/verify_version.json "$server_url/$resource_type?url=$url")
    local http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        # Extract version from server response
        if command -v jq &> /dev/null; then
            local version=$(jq -r '.entry[0].resource.version // "N/A"' /tmp/verify_version.json 2>/dev/null)
        else
            local version=$(grep -A 20 '"entry"' /tmp/verify_version.json | grep -A 10 '"resource"' | grep '"version"' | head -1 | sed 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
            if [ -z "$version" ]; then
                version="N/A"
            fi
        fi
        echo "$version"
    else
        echo "N/A"
    fi
}

# Function to get local version from file
get_local_version() {
    local file="$1"
    local version=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' "$file" | head -1 | sed 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
    if [ -z "$version" ]; then
        echo "N/A"
    else
        echo "$version"
    fi
}

# Initialize counters
total_resources=0
found_resources=0
missing_resources=0

echo "=== VERIFICATION REPORT ==="
echo ""

# Verify CodeSystems
echo "CodeSystems:"
echo "File Name                    | URL                                    | Status | Local Version | Server Version"
echo "----------------------------|----------------------------------------|--------|---------------|---------------"
for f in CodeSystem*.json; do
    if [ -f "$f" ]; then
        total_resources=$((total_resources + 1))
        url=$(get_resource_url "$f")
        resource_type=$(get_resource_type "$f")
        status=$(check_resource_on_server "$url" "$resource_type" "$FHIR_SERVER_URL")
        local_version=$(get_local_version "$f")
        server_version=$(get_server_version "$url" "$resource_type" "$FHIR_SERVER_URL")
        
        if [ "$status" = "✓" ]; then
            found_resources=$((found_resources + 1))
        else
            missing_resources=$((missing_resources + 1))
        fi
        
        printf "%-28s | %-38s | %-6s | %-13s | %-13s\n" "$(basename "$f")" "$url" "$status" "$local_version" "$server_version"
    fi
done

echo ""

# Verify ValueSets
echo "ValueSets:"
echo "File Name                    | URL                                    | Status | Local Version | Server Version"
echo "----------------------------|----------------------------------------|--------|---------------|---------------"
for f in ValueSet*.json; do
    if [ -f "$f" ]; then
        total_resources=$((total_resources + 1))
        url=$(get_resource_url "$f")
        resource_type=$(get_resource_type "$f")
        status=$(check_resource_on_server "$url" "$resource_type" "$FHIR_SERVER_URL")
        local_version=$(get_local_version "$f")
        server_version=$(get_server_version "$url" "$resource_type" "$FHIR_SERVER_URL")
        
        if [ "$status" = "✓" ]; then
            found_resources=$((found_resources + 1))
        else
            missing_resources=$((missing_resources + 1))
        fi
        
        printf "%-28s | %-38s | %-6s | %-13s | %-13s\n" "$(basename "$f")" "$url" "$status" "$local_version" "$server_version"
    fi
done

echo ""

# Verify StructureDefinitions
echo "StructureDefinitions:"
echo "File Name                    | URL                                    | Status | Local Version | Server Version"
echo "----------------------------|----------------------------------------|--------|---------------|---------------"
for f in StructureDefinition*.json; do
    if [ -f "$f" ]; then
        total_resources=$((total_resources + 1))
        url=$(get_resource_url "$f")
        resource_type=$(get_resource_type "$f")
        status=$(check_resource_on_server "$url" "$resource_type" "$FHIR_SERVER_URL")
        local_version=$(get_local_version "$f")
        server_version=$(get_server_version "$url" "$resource_type" "$FHIR_SERVER_URL")
        
        if [ "$status" = "✓" ]; then
            found_resources=$((found_resources + 1))
        else
            missing_resources=$((missing_resources + 1))
        fi
        
        printf "%-28s | %-38s | %-6s | %-13s | %-13s\n" "$(basename "$f")" "$url" "$status" "$local_version" "$server_version"
    fi
done

echo ""

# Summary
echo "=== SUMMARY ==="
echo "Total resources found: $total_resources"
echo "Successfully uploaded: $found_resources"
echo "Missing on server: $missing_resources"
echo ""

if [ $missing_resources -eq 0 ]; then
    echo "✅ All resources are successfully uploaded to the server!"
    exit 0
else
    echo "❌ Some resources are missing on the server. Please run uploadig.sh to upload them."
    exit 1
fi

# Clean up temporary files
rm -f /tmp/verify_check.json /tmp/verify_version.json 