#!/usr/bin/env python3
"""
Step 5: Bundle Generation for RecuperoGenerator
Generates N bundles, each with a unique identifier.value and current timestamp.
Uses the randomized template as a base. Each bundle is saved as a separate JSON file.
"""

import json
import uuid
from datetime import datetime
from pathlib import Path
import copy

def load_template(template_file: str):
    with open(template_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_unique_identifier():
    return str(uuid.uuid4())

def get_current_timestamp():
    return datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")

def main():
    print("📦 Step 5: Bundle Generation")
    print("=" * 50)
    
    template_file = "output/Bundle-DateRandomized.json"
    try:
        template = load_template(template_file)
        print(f"✅ Loaded template: {template_file}")
    except Exception as e:
        print(f"❌ Failed to load template: {e}")
        return

    # Ask user for number of bundles
    try:
        n_bundles = int(input("How many bundles do you want to generate? "))
    except Exception:
        print("❌ Invalid input. Please enter an integer.")
        return

    output_dir = Path("output/bundles")
    output_dir.mkdir(parents=True, exist_ok=True)

    for i in range(n_bundles):
        bundle = copy.deepcopy(template)
        # Set unique identifier
        bundle['identifier']['value'] = generate_unique_identifier()
        # Set current timestamp
        bundle['timestamp'] = get_current_timestamp()
        # Save bundle
        bundle_filename = output_dir / f"Bundle-Generated-{i+1:03d}.json"
        with open(bundle_filename, 'w', encoding='utf-8') as f:
            json.dump(bundle, f, indent=2, ensure_ascii=False)
        print(f"✅ Bundle saved: {bundle_filename}")

    print(f"\n🎉 {n_bundles} bundles generated in {output_dir}/")

if __name__ == "__main__":
    main() 