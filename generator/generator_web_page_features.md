1) Selection of FHIR Server. Default: https://fhirserver.hl7fundamentals.org/fhir/metadata
2) Master Lists available for Random Pickup or Manual Select
a) Coberturas (from codeSystems)
b) Diagnostico (from codeSystems)
c) Procedimientos (from CodeSystems)
d) Tipos de Documento (from CodeSystems)
e) Tipos de Matricula (from CodeSystems)
f) Profesiones (from CodeSystems)
3) Entity Lists Available for Random Pickup or Manual Select
a) 50 Spanish Person names, birthdate, gender, identifier(dni), internal identifier for Patients
b) 50 Spanish Person names, Profesion, tipo y numero de matricula for Clinicians and Biochemists
c) 3 performer sites: 
i) Laboratorio 1:http://laboratorio1.gob.ar/
ii) Laboratorio Hospital 1: http://laboratorio-hospital1.gob.ar/
iii) Laboratorio Hospital 2 http://laboratorio-hospital2.gob.ar/
d) 3 requester sites
i) Hospital 1:http://hospital1.gob.ar/
ii) Hospital 2: http://hospital2.gob.ar/
iii) Hospital 3 http://hospital3.gob.ar/
It is very important to generate identifiers for the patients, clinicians and biochemists to obbey the rules defined in the files namingconventions.md
4) Enable Two modes: random and manual. Random mode is just a button
5) In random mode, randomly select:
- One Patient from the Patient list
- One Clinician from the Clinician list: this will be the REQUESTER
- One Biochemist from the Clinician list: this will be the PERFORMER
- One Performer Site
- One Requester Site
- 3 to 20 prestaciones: this will be the PROCEDURES
- One Insurance from Coberturas: this will be the INSURANCE
- Create one PDF with just one word "ATTACHMENT FOR "+ Patient Full Name
- Use the template in Bundle-RecuperoCABABundleEjemplo.json to create our Bundle
- Define random dates near 'now' but a few days before for the dates or date time fields
- Complete the Bundle with the items selected or generated in the previous steps
- POST the Bundle to the FHIR Server
- Report the result of the POST method
6) In Manual mode, everything is the same, but the user will have to select the items from the lists, so we need to have a visual way to enable this. 
- In Manual mode, the user can upload a PDF file in order to serve as attachment - to session or local storage, since we have no server storage for users
