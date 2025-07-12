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

# Upload CodeSystems
echo "Uploading CodeSystems..."
for f in CodeSystem*.json; do
    if [ -f "$f" ]; then
        echo "  Uploading $f..."
        curl -s -d @"$f" "$FHIR_SERVER_URL"/CodeSystem -H "Content-Type: application/json"
        echo ""
    fi
done

# Upload ValueSets
echo "Uploading ValueSets..."
for f in ValueSet*.json; do
    if [ -f "$f" ]; then
        echo "  Uploading $f..."
        curl -s -d @"$f" "$FHIR_SERVER_URL"/ValueSet -H "Content-Type: application/json"
        echo ""
    fi
done

# Upload StructureDefinitions
echo "Uploading StructureDefinitions..."
for f in StructureDefinition*.json; do
    if [ -f "$f" ]; then
        echo "  Uploading $f..."
        curl -s -d @"$f" "$FHIR_SERVER_URL"/StructureDefinition -H "Content-Type: application/json"
        echo ""
    fi
done

echo ""
echo "Upload completed!" 