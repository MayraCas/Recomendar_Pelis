# ✅ Checklist de Verificación - CineMatch

## Antes de ejecutar la aplicación

### 1. Neo4j Database
- [ ] Neo4j Desktop o servidor instalado
- [ ] Servicio Neo4j corriendo en `localhost:7687`
- [ ] Base de datos creada y activa
- [ ] Script `moviesNeo4j.cql` ejecutado correctamente
- [ ] Verificar datos con: `MATCH (n) RETURN n LIMIT 25`

### 2. Configuración del Proyecto
- [ ] Node.js instalado (v16+)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Credenciales de Neo4j actualizadas en `src/neo4j.js`
- [ ] Puerto 5173 disponible

### 3. Archivos del Proyecto
- [ ] Todos los componentes creados
- [ ] Archivos CSS correspondientes creados
- [ ] No hay errores de ESLint
- [ ] Imports correctos en todos los archivos

## Verificación de Funcionalidades

### Selector de Usuario
- [ ] Muestra los 4 usuarios (Juan, María, Pedro, Ana)
- [ ] Cambiar usuario actualiza las recomendaciones
- [ ] Cambiar usuario actualiza el historial
- [ ] Diseño en tonos pastel correcto

### Sistema de Recomendaciones
- [ ] Botón "Usuarios similares" funciona
- [ ] Botón "Mismos géneros" funciona
- [ ] Botón "Mejor calificadas" funciona
- [ ] Muestra información de películas (título, año, géneros)
- [ ] Muestra rating promedio con estrellas
- [ ] Cards con hover effect funcionan

### Calificar Película
- [ ] Buscador funciona con 2+ letras
- [ ] Autocompletado muestra sugerencias
- [ ] Selección de película funciona
- [ ] Estrellas interactivas (hover y click)
- [ ] Mensaje de confirmación aparece
- [ ] Actualiza recomendaciones e historial

### Historial de Usuario
- [ ] Muestra películas vistas
- [ ] Ordenado por fecha (más reciente primero)
- [ ] Muestra rating dado por el usuario
- [ ] Muestra géneros y duración
- [ ] Muestra fecha de visualización

### Catálogo de Películas
- [ ] Muestra todas las películas
- [ ] Rating promedio calculado correctamente
- [ ] Total de valoraciones correcto
- [ ] Géneros mostrados correctamente
- [ ] Cards con diseño consistente

### Búsqueda de Películas
- [ ] Búsqueda funciona con texto parcial
- [ ] Debounce de 300ms funciona
- [ ] Sugerencias son clickeables
- [ ] Muestra información completa en sugerencias
- [ ] Input se llena con película seleccionada

## Pruebas de Usuario

### Escenario 1: Usuario Nuevo
- [ ] Seleccionar usuario "Ana"
- [ ] Ver recomendaciones disponibles
- [ ] Calificar una nueva película
- [ ] Verificar que aparece en historial
- [ ] Verificar actualización de recomendaciones

### Escenario 2: Cambio de Usuario
- [ ] Cambiar de "Juan" a "María"
- [ ] Recomendaciones diferentes
- [ ] Historial diferente
- [ ] Calificar película como María
- [ ] Volver a Juan y verificar su historial

### Escenario 3: Búsqueda y Calificación
- [ ] Buscar "Matrix"
- [ ] Seleccionar de sugerencias
- [ ] Dar 5 estrellas
- [ ] Guardar calificación
- [ ] Verificar en historial

### Escenario 4: Explorar Recomendaciones
- [ ] Probar filtro "Usuarios similares"
- [ ] Probar filtro "Mismos géneros"
- [ ] Probar filtro "Mejor calificadas"
- [ ] Verificar que cada uno muestra resultados diferentes

## Verificación de Diseño

### Colores y Tema
- [ ] Paleta azul y morado pastel aplicada
- [ ] Gradientes visibles en botones y badges
- [ ] Contraste de texto legible
- [ ] Hover effects funcionan
- [ ] Sombras y bordes consistentes

### Responsive Design
- [ ] Desktop (1200px+) - 3 columnas en grids
- [ ] Tablet (768px-1200px) - 2 columnas
- [ ] Móvil (<768px) - 1 columna
- [ ] Botones de filtro apilados en móvil
- [ ] Texto legible en todos los tamaños

### Animaciones
- [ ] Estrellas con efecto bounce al seleccionar
- [ ] Cards con transform al hover
- [ ] Mensajes con slideIn animation
- [ ] Transiciones suaves (0.3s)

## Verificación de Datos Neo4j

### Consultas de Prueba
```cypher
// Verificar usuarios
MATCH (u:Usuario) RETURN u.nombre, u.edad, u.email

// Verificar películas
MATCH (p:Pelicula) RETURN p.titulo, p.year, p.duracion

// Verificar géneros
MATCH (g:Genero) RETURN g.nombre

// Verificar calificaciones
MATCH (u:Usuario)-[v:VIO]->(p:Pelicula) 
RETURN u.nombre, p.titulo, v.rating, v.fecha

// Verificar recomendaciones para Juan
MATCH (u:Usuario {nombre: 'Juan'})-[v1:VIO]->(p1:Pelicula)
WHERE v1.rating >= 4
MATCH (otros:Usuario)-[v2:VIO]->(p1)
WHERE otros <> u AND v2.rating >= 4
MATCH (otros)-[v3:VIO]->(recomendacion:Pelicula)
WHERE NOT (u)-[:VIO]->(recomendacion) AND v3.rating >= 4
RETURN DISTINCT recomendacion.titulo
```

## Problemas Comunes y Soluciones

### ❌ No se conecta a Neo4j
**Solución:**
- Verificar que Neo4j esté corriendo
- Revisar credenciales en `src/neo4j.js`
- Verificar puerto 7687

### ❌ No aparecen películas
**Solución:**
- Ejecutar script `moviesNeo4j.cql` en Neo4j Browser
- Verificar datos con `MATCH (n) RETURN n`

### ❌ Recomendaciones vacías
**Solución:**
- Usuario necesita más calificaciones
- Otros usuarios necesitan calificar películas similares
- Ejecutar `peliculas_adicionales.cql` para más datos

### ❌ Error de CORS
**Solución:**
- Cambiar a `bolt://` en lugar de `neo4j://`
- Verificar `encrypted: "ENCRYPTION_OFF"`

### ❌ Estilos no se aplican
**Solución:**
- Verificar importaciones de CSS en componentes
- Refrescar caché del navegador (Ctrl+Shift+R)
- Verificar que `index.css` se importa en `main.jsx`

## Checklist Final

- [ ] ✅ Aplicación corre sin errores
- [ ] ✅ Neo4j conectado correctamente
- [ ] ✅ Todos los componentes funcionan
- [ ] ✅ Diseño consistente y bonito
- [ ] ✅ Responsive en móvil
- [ ] ✅ Recomendaciones funcionando
- [ ] ✅ Búsqueda con autocompletado funciona
- [ ] ✅ Calificaciones se guardan correctamente
- [ ] ✅ Historial se actualiza
- [ ] ✅ Sin errores en consola

---

## 🎉 ¡Todo listo!

Si todos los checkboxes están marcados, ¡tu aplicación está lista para usar!

**Comando para iniciar:**
```bash
npm run dev
```

**URL:**
```
http://localhost:5173
```

¡Disfruta de CineMatch! 🍿🎬
