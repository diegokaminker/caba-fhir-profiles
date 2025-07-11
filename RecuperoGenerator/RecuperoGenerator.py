#!/usr/bin/env python3
"""
RecuperoGenerator: Main Integration Script
Guides the user through the full workflow:
  1. Load code systems
  2. Randomize patient, procedure, and date data
  3. Generate bundles
  4. POST bundles to a FHIR server
Allows configuration and provides clear progress and summary output.
"""

import os
import sys
import subprocess
from pathlib import Path
import json

# Configurable paths
CODESYSTEMS_DIR = Path("../input/fsh/terminology")
TEMPLATE_PATH = Path("output/Bundle-RecuperoCABABundleEjemplo.json")
OUTPUT_DIR = Path("output")
BUNDLES_DIR = OUTPUT_DIR / "bundles"

# Step scripts
STEP2 = "step2_patient_randomization.py"
STEP3 = "step3_procedure_randomization.py"
STEP4 = "step4_date_randomization.py"
STEP5 = "step5_generate_bundles.py"
STEP6 = "step6_post_bundles.py"


def run_step(script, args=None):
    cmd = [sys.executable, script]
    if args:
        cmd += args
    print(f"\n🚀 Running {script} ...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print(f"❌ Error in {script}:\n{result.stderr}")
        sys.exit(1)


def main():
    print("\n============================")
    print("  RecuperoGenerator v1.0")
    print("============================\n")
    print("This program will:")
    print("  1. Load code systems")
    print("  2. Randomize patient, procedure, and date data")
    print("  3. Generate bundles")
    print("  4. POST bundles to a FHIR server\n")

    # Step 2: Patient randomization
    run_step(STEP2)

    # Step 3: Procedure randomization
    run_step(STEP3)

    # Step 4: Date randomization
    run_step(STEP4)

    # Step 5: Bundle generation
    print("\nHow many bundles do you want to generate?")
    n_bundles = input("Enter number: ")
    run_step(STEP5, [n_bundles])

    # Step 6: FHIR server POST
    print("\nDo you want to POST the bundles to the FHIR server now? [y/N]")
    do_post = input().strip().lower()
    if do_post == 'y':
        run_step(STEP6)
    else:
        print("Skipping FHIR server POST.")

    print("\n🎉 Workflow complete! See the output/bundles/ directory for generated bundles.")
    print("Check the README.md for more information.")

if __name__ == "__main__":
    main() 