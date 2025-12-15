# React + Vite + Neo4j

Este README describe los requisitos, la instalación de Neo4j y cómo ejecutar una aplicación React que se conecte a Neo4j.

## Requisitos del entorno

### Software necesario: 
- Node.js v18 o superior
- npm o yarn
- Neo4j (Community o Enterprise)
- Navegador web moderno

### Conocimientos recomendados
- JavaScript / React
- Conceptos básicos de bases de datos de grafos
- Uso de terminal

## Instalación de Neo4j en Ubuntu

- Importar la clave GPG de Neo4j:
wget -O - https://debian.neo4j.com/neotechnology.gpg.key | sudo apt-key add -

- Agregar el repositorio: 
echo 'deb https://debian.neo4j.com stable latest' | sudo tee /etc/apt/sources.list.d/neo4j.list

- Actualizar la lista de paquetes: 
sudo apt update

- Instalar Neo4j Community Edition: 
sudo apt install neo4j

- O si se necesita la versión Enterprise: 
sudo apt install neo4j-enterprise

- Iniciar Neo4j: 
sudo systemctl start neo4j

- Habilitar inicio automático: 
sudo systemctl enable neo4j

- Verificar el estado: 
sudo systemctl status neo4j

- Abriri el navegador y acceder a: 
http://localhost:7474

- Usuario por defecto: neo4j
- Contraseña por defecto: neo4j (pedirá cambiarla en el primer login)

## Configuración de la conexión a Neo4j
- Instalar el driver oficial:
npm install neo4j-driver

- Cambiar las credenciales en la conexión a la BDG

## Ejecución de la aplicación React
- Instalar dependencias:
npm install

- Ejecutar el proyecto:
npm start

- La aplicación se ejecutará en:
http://localhost:3000

# Recomendar_Pelis
