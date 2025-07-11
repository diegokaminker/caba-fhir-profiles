#!/usr/bin/env python3
"""
Step 6: FHIR Server Integration for RecuperoGenerator
POSTs all generated bundles to the configured FHIR server endpoint.
"""

import requests
import json
from pathlib import Path

FHIR_SERVER_URL = "http://fhirserver.hl7fundamentals.org/fhir/Bundle"
BUNDLES_DIR = Path("output/bundles")


def post_bundle(bundle_path):
    with open(bundle_path, 'r', encoding='utf-8') as f:
        bundle_json = json.load(f)
    headers = {"Content-Type": "application/fhir+json"}
    response = requests.post(FHIR_SERVER_URL, headers=headers, json=bundle_json)
    return response


def main():
    print("🌐 Step 6: FHIR Server Integration")
    print("=" * 50)
    if not BUNDLES_DIR.exists():
        print(f"❌ Bundles directory not found: {BUNDLES_DIR}")
        return
    bundle_files = sorted(BUNDLES_DIR.glob("Bundle-Generated-*.json"))
    if not bundle_files:
        print(f"❌ No bundles found in {BUNDLES_DIR}")
        return
    print(f"Found {len(bundle_files)} bundles to POST.")
    for bundle_file in bundle_files:
        print(f"\n➡️  Posting {bundle_file.name} ...")
        try:
            response = post_bundle(bundle_file)
            print(f"   Status: {response.status_code}")
            try:
                resp_json = response.json()
                print(f"   Response: {json.dumps(resp_json, indent=2)[:500]}...")
            except Exception:
                print(f"   Response: {response.text[:500]}...")
        except Exception as e:
            print(f"   ❌ Error posting {bundle_file.name}: {e}")
    print("\n✅ All bundles processed.")

if __name__ == "__main__":
    main() 