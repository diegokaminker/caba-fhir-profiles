# RecuperoGenerator

A synthetic FHIR Bundle generator for testing and integration with FHIR servers, based on real-world code systems and randomized patient/procedure data.

## Features
- Loads local FSH code systems for procedures, diagnoses, and coverages
- Randomizes patient, procedure, and date data while preserving FHIR structure
- Generates any number of FHIR Bundles with unique identifiers and timestamps
- Optionally POSTs generated bundles to a configurable FHIR server endpoint
- Designed for reproducibility, de-identification, and compliance

## Workflow
```
+-------------------+
|  Load CodeSystems |
+-------------------+
          |
          v
+-------------------+
| Randomize Patient |
+-------------------+
          |
          v
+-------------------+
| Randomize Proc/CD |
+-------------------+
          |
          v
+-------------------+
| Randomize Dates   |
+-------------------+
          |
          v
+-------------------+
| Generate Bundles  |
+-------------------+
          |
          v
+-------------------+
| POST to FHIR Srv  |
+-------------------+
```

## Setup
1. **Clone the repository** and enter the directory:
   ```sh
   git clone <your-repo-url>
   cd RecuperoGenerator
   ```
2. **Create a virtual environment** (recommended):
   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```
3. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
   (If `requirements.txt` is missing, install at least `requests` and `faker`.)

## Usage
Run the main program:
```sh
python RecuperoGenerator.py
```
You will be guided through each step:
- Patient randomization
- Procedure randomization
- Date randomization
- Bundle generation (choose how many)
- Optionally POST to a FHIR server

### Configuration
- **Number of bundles:** Prompted at runtime
- **FHIR server URL:** Edit `step6_post_bundles.py` to change the endpoint
- **Code systems:** Place FSH files in `../input/fsh/terminology/`
- **Template:** The base template is in `output/Bundle-RecuperoCABABundleEjemplo.json`

### Output
- Bundles are saved in `output/bundles/` as JSON files
- Reports and logs are generated for each step

## Troubleshooting
- If you see `ModuleNotFoundError: No module named 'requests'`, run `pip install requests`
- If you see `ModuleNotFoundError: No module named 'faker'`, run `pip install faker`
- Ensure your virtual environment is activated
- Check file paths if you move the project directory

## Support
For questions or issues, please open an issue in the repository or contact the maintainer.

---

**FHIR server example endpoint:**  
http://fhirserver.hl7fundamentals.org/fhir/Bundle

**Project by:** Diego & AI assistant 