# GitHub Repository Setup Instructions

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `caba-fhir-profiles` (or your preferred name)
   - **Description**: `FHIR R4 profiles and terminology for CABA healthcare reimbursement system`
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Add Remote and Push

After creating the repository, GitHub will show you the commands. Run these in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Set the main branch as upstream
git branch -M main

# Push the code to GitHub
git push -u origin main
```

## Step 3: Verify

1. Go to your GitHub repository URL
2. Verify all files are uploaded correctly
3. Check that the README.md displays properly

## Repository Structure

Your repository will contain:

### FHIR Profiles
- `caba-recupero-claim.fsh` - Healthcare claim profile
- `caba-recupero-patient.fsh` - Patient profile
- `caba-recupero-practitioner.fsh` - Healthcare practitioner profile
- `caba-recupero-encounter.fsh` - Healthcare encounter profile
- `caba-recupero-servicerequest.fsh` - Service request profile
- `caba-recupero-documentreference.fsh` - Document reference profile
- `caba-recupero-bundle.fsh` - Bundle profile

### Code Systems
- `caba-recupero-coberturas.fsh` - Insurance coverage codes
- `caba-recupero-diagnostico.fsh` - Diagnosis codes
- `caba-recupero-procedimientos.fsh` - Procedure codes
- `caba-recupero-profesiones.fsh` - Healthcare profession codes
- `caba-recupero-tiposdocumento.fsh` - Document type codes
- `caba-recupero-tiposmatricula.fsh` - License type codes

### Value Sets
- Corresponding value sets for each code system

### Examples
- `ejemplo-1-recupero-claim.fsh` - Example claim with laboratory services

### Build Scripts
- `_genonce.sh` - Generate implementation guide once
- `_gencontinuous.sh` - Continuous generation for development
- `_build.sh` - Build the complete implementation guide

## Next Steps

After pushing to GitHub:

1. **Set up GitHub Pages** (optional):
   - Go to Settings > Pages
   - Select source branch (usually main)
   - Enable GitHub Pages

2. **Add collaborators** (if needed):
   - Go to Settings > Collaborators
   - Add team members

3. **Set up branch protection** (recommended):
   - Go to Settings > Branches
   - Add rule for main branch
   - Require pull request reviews

4. **Create issues and milestones**:
   - Plan future development
   - Track bugs and features

## Repository Features

- ✅ FHIR R4 compliant profiles
- ✅ Comprehensive code systems and value sets
- ✅ Build automation scripts
- ✅ Detailed documentation
- ✅ Proper .gitignore configuration
- ✅ Professional README with usage instructions

## Support

If you encounter any issues:
1. Check the README.md for detailed instructions
2. Review the FHIR specification documentation
3. Create an issue in the repository
4. Contact the development team 