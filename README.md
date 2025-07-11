# FHIR Profiling Project - CABA Recupero

This repository contains FHIR profiles, code systems, value sets, and examples for the CABA (Ciudad Autónoma de Buenos Aires) healthcare reimbursement system.

## 📋 Overview

This project implements FHIR R4 resources and terminology for healthcare claims processing in the CABA healthcare system, specifically focused on laboratory services and medical procedures.

## 🏗️ Project Structure

```
cursoprofiling/
├── input/
│   └── fsh/
│       ├── profiles/           # FHIR Resource Profiles
│       ├── terminology/        # Code Systems & Value Sets
│       │   ├── codesystems/    # Code System Definitions
│       │   └── valuesets/      # Value Set Definitions
│       ├── examples/           # FHIR Resource Examples
│       ├── extensions/         # Custom Extensions
│       └── logical_models/     # Logical Models
├── output/                     # Generated FHIR Resources
├── template/                   # IG Template Files
├── fsh-generated/             # FSH Generated Files
├── sushi-config.yaml          # SUSHI Configuration
└── ig.ini                     # Implementation Guide Config
```

## 🔧 FHIR Resources

### Profiles
- **caba-recupero-claim.fsh** - Healthcare claim profile
- **caba-recupero-patient.fsh** - Patient profile
- **caba-recupero-practitioner.fsh** - Healthcare practitioner profile
- **caba-recupero-encounter.fsh** - Healthcare encounter profile
- **caba-recupero-servicerequest.fsh** - Service request profile
- **caba-recupero-documentreference.fsh** - Document reference profile
- **caba-recupero-bundle.fsh** - Bundle profile

### Code Systems
- **caba-recupero-coberturas.fsh** - Insurance coverage codes
- **caba-recupero-diagnostico.fsh** - Diagnosis codes
- **caba-recupero-procedimientos.fsh** - Procedure codes
- **caba-recupero-profesiones.fsh** - Healthcare profession codes
- **caba-recupero-tiposdocumento.fsh** - Document type codes
- **caba-recupero-tiposmatricula.fsh** - License type codes

### Examples
- **ejemplo-1-recupero-claim.fsh** - Example claim with laboratory services

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- SUSHI (FHIR Shorthand compiler)
- FHIR IG Publisher

### Installation

1. **Install SUSHI**
   ```bash
   npm install -g fsh-sushi
   ```

2. **Install FHIR IG Publisher**
   ```bash
   # Follow the official FHIR IG Publisher installation guide
   ```

3. **Clone this repository**
   ```bash
   git clone <repository-url>
   cd cursoprofiling
   ```

### Building the Implementation Guide

1. **Generate FHIR resources from FSH**
   ```bash
   sushi .
   ```

2. **Build the Implementation Guide**
   ```bash
   ./_genonce.sh
   ```

3. **For continuous development**
   ```bash
   ./_gencontinuous.sh
   ```

## 📊 Data Sources

The terminology and profiles are based on:
- CABA healthcare system requirements
- Laboratory service codes
- Medical procedure classifications
- Healthcare provider registries
- Insurance coverage definitions

## 🔒 Privacy & Security

- All examples use de-identified data
- No real patient information is included
- Fictional names and identifiers are used for testing
- Compliant with HIPAA and local privacy regulations

## 📝 Naming Conventions

The project follows FHIR naming conventions:
- **Profiles**: `caba-recupero-[resource].fsh`
- **Code Systems**: `caba-recupero-[domain].fsh`
- **Value Sets**: `caba-recupero-[domain]-vs.fsh`
- **Examples**: `ejemplo-[number]-[description].fsh`

## 🛠️ Development

### Adding New Profiles
1. Create FSH file in `input/fsh/profiles/`
2. Follow naming convention
3. Include proper metadata and constraints
4. Add to sushi-config.yaml if needed

### Adding New Code Systems
1. Create FSH file in `input/fsh/terminology/codesystems/`
2. Define codes with proper descriptions
3. Create corresponding value sets
4. Reference in profiles as needed

### Testing
- Use SUSHI validation: `sushi -s .`
- Validate against FHIR validator
- Test with FHIR test servers

## 📚 Documentation

- **FHIR R4 Specification**: https://www.hl7.org/fhir/
- **FSH Documentation**: https://build.fhir.org/ig/HL7/fhir-shorthand/
- **SUSHI Documentation**: https://fshschool.org/

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## 🆘 Support

For questions or issues:
- Create an issue in this repository
- Contact the development team
- Check FHIR community forums

## 🔄 Version History

- **v1.0.0** - Initial implementation with basic profiles and terminology
- **v1.1.0** - Added laboratory service codes and examples
- **v1.2.0** - Enhanced with bundle examples and de-identified data

---

**Note**: This is a development and testing environment. Do not use with real patient data without proper review and approval. 