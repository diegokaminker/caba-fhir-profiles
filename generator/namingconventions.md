Expresión Técnica (Naming Conventions)
Se debe asignar un conjunto system/value globalmente único a cada identificador, por lo cual expresamos esta propuesta de estrategias de identificación:
A) Identificadores Únicos para cada Hospital/Laboratorio
Generamos primero una uri base de dominio para cada efector
Efector
URI Dominio
Laboratorio 1
http://laboratorio1.gob.ar/
Hospital 1
http://hospital1.gob.ar/
Hospital 2
http://hospital2.gob.ar/

A continuación generamos una rama para cada tipo de elemento, ejemplo presentado aquí para el Laboratorio 1
Elemento
system
value
idPaciente
http://laboratorio1.gob.ar/pacientes
El identificador del paciente en el lab
idEpisodio
http://laboratorio1.gob.ar/episodios
El identificador del episodio en el lab
idPedido
http://laboratorio1.gob.ar/pedidos
El identificador del pedido en el lab


B) Identificadores Únicos para cada Tipo de Matricula
Generamos primero un identificador base de dominio para las matrículas (deberia ser REFEPS, pero para este proyecto vamos a definir uno propio)
http://recupero.gob.ar/matriculas/
Para definir el sistema de identificación, le agregamos al final el código de entidad.
El solicitante tiene matrícula emitida por el Ministerio de Salud de la Ciudad de Buenos Aires (10006441714000)
El firmante tiene matrícula emitida por el Colegio de BIOQUIMICOS ZONA I, de BAHÍA BLANCA ( 75060562116524), entonces sería:
 
Elemento
System
Value
idMatriculaSolicitante
http://recupero.gob.ar/matriculas/10006441714000
Número de matrícula asignada
idMatriculaFirmante
http://recupero.gob.ar/matriculas/75060562116524
Número de matrícula asignada

Identificadores Únicos para cada Cobertura
Generamos primero un identificador base de dominio para las coberturas
http://recupero.gob.ar/coberturas/
Para definir el sistema de identificación, le agregamos al final el código de cobertura
El paciente tiene cobertura de Medifé (MP056), carnet 1234567890-1

Elemento
System
Value
idCobertura
http://recupero.gob.ar/coberturas/MP056/
 1234567890-1


C) Identificadores Únicos para cada Tipo de Documento 
Documento de Identidad Argentino: http://renaper.gob.ar/dni
Pasaportes:
http://recupero.gob.ar/pasaportes/
Para definir el sistema de identificación, le agregamos al final el código de país
El paciente es Argentino y tiene DNI 99999999
El paciente es Ecuatoriano y tiene Pasaporte # 3029399A

Elemento
System
Value
idPaciente
http://renaper.gob.ar/dni
 99999999
idPaciente
http://recupero.gob.ar/pasaportes/EC/
 3029399A



