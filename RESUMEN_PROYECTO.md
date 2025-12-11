# 🎬 CineMatch - Resumen del Proyecto

## 📁 Estructura del Proyecto

```
aplication-movies/
├── 📄 index.html
├── 📄 package.json
├── 📄 vite.config.js
├── 📄 eslint.config.js
├── 📄 README.md
├── 📄 PROYECTO_README.md          # Documentación completa
├── 📄 GUIA_USO.md                 # Guía de uso rápida
│
├── 📂 database/
│   ├── moviesNeo4j.cql            # Script principal de datos
│   └── peliculas_adicionales.cql  # Datos adicionales (opcional)
│
├── 📂 public/
│
└── 📂 src/
    ├── 📄 main.jsx                # Punto de entrada
    ├── 📄 App.jsx                 # Componente principal
    ├── 📄 App.css                 # Estilos principales
    ├── 📄 index.css               # Estilos globales + tema
    ├── 📄 neo4j.js                # Configuración Neo4j
    │
    ├── 📂 assets/
    │
    └── 📂 components/
        ├── SelectorUsuario.jsx         # Selector de usuario
        ├── SelectorUsuario.css
        ├── RecomendacionesPeliculas.jsx  # Sistema de recomendaciones
        ├── RecomendacionesPeliculas.css
        ├── CalificarPelicula.jsx       # Calificar películas
        ├── CalificarPelicula.css
        ├── HistorialUsuario.jsx        # Historial de películas vistas
        ├── HistorialUsuario.css
        ├── ListaPeliculas.jsx          # Catálogo completo
        ├── ListaPeliculas.css
        ├── BuscadorPeliculas.jsx       # Búsqueda con autocompletado
        └── BuscadorPeliculas.css
```

## 🎨 Componentes Visuales

### 🏠 Página Principal (App.jsx)
```
┌─────────────────────────────────────────────────┐
│        🎬 CineMatch                             │
│   Tu sistema de recomendación personalizado     │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  👤 Usuario actual: [Selector de Usuario ▼]    │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  🎬 Recomendaciones para Juan                   │
│  [👥 Usuarios similares] [🎭 Géneros] [🏆 Top] │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ Película│ │ Película│ │ Película│           │
│  │   Card  │ │   Card  │ │   Card  │           │
│  └─────────┘ └─────────┘ └─────────┘           │
└─────────────────────────────────────────────────┘
┌──────────────────────┐ ┌──────────────────────┐
│ ⭐ Calificar         │ │ 📜 Mis Películas     │
│ 🔍 Buscar película   │ │    Vistas            │
│ ⭐⭐⭐⭐⭐           │ │ • Matrix       ⭐⭐⭐⭐⭐│
│ [💾 Guardar]        │ │ • Inception    ⭐⭐⭐⭐ │
└──────────────────────┘ └──────────────────────┘
┌─────────────────────────────────────────────────┐
│  🎥 Catálogo de Películas                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ Película│ │ Película│ │ Película│           │
│  │   Card  │ │   Card  │ │   Card  │           │
│  └─────────┘ └─────────┘ └─────────┘           │
└─────────────────────────────────────────────────┘
```

## 🎨 Paleta de Colores

### Colores Principales
```css
--color-primary: #a5b4fc         /* Azul pastel */
--color-primary-dark: #818cf8    /* Azul más oscuro */
--color-secondary: #c4b5fd       /* Morado pastel */
--color-secondary-dark: #a78bfa  /* Morado más oscuro */
--color-accent: #e9d5ff          /* Lila claro */
```

### Fondos
```css
--color-bg-primary: #f5f7ff      /* Fondo general */
--color-bg-secondary: #ffffff    /* Fondo cards */
--color-bg-hover: #eef2ff        /* Hover states */
```

### Textos
```css
--color-text-primary: #1e1b4b    /* Texto principal */
--color-text-secondary: #4c1d95  /* Títulos */
--color-text-muted: #6366f1      /* Texto secundario */
```

### Gradientes
```css
--gradient-primary: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 100%)
--gradient-secondary: linear-gradient(135deg, #ddd6fe 0%, #e9d5ff 100%)
```

## 🔄 Flujo de Datos

```
Usuario selecciona usuario
         ↓
  Estado global (usuarioActual)
         ↓
    ┌────┴────┬──────────┬─────────┐
    ↓         ↓          ↓         ↓
Recomend.  Calificar  Historial  Catálogo
    ↓         ↓          ↓         ↓
 Neo4j ←──────┴──────────┴─────────┘
(Consultas Cypher)
```

## 🎯 Algoritmos de Recomendación

### 1. Usuarios Similares
- Encuentra usuarios que vieron las mismas películas
- Solo considera ratings ≥ 4
- Recomienda películas que esos usuarios calificaron bien
- Ordena por cantidad de coincidencias y rating promedio

### 2. Mismos Géneros
- Identifica los 2 géneros favoritos del usuario
- Busca películas de esos géneros no vistas
- Ordena por rating promedio

### 3. Mejor Calificadas
- Muestra películas no vistas con mejor rating
- Requiere mínimo 2 valoraciones
- Ordena por rating promedio y cantidad de valoraciones

## 📊 Modelo de Datos Neo4j

```
(Usuario)
    ↓ [:VIO {rating, fecha}]
(Pelicula) ←─ [:DIRIGE] ─── (Director)
    ↓ [:PERTENECE_A]
(Genero)
    
(Actor) ─── [:ACTUA_EN {rol}] ──→ (Pelicula)
```

## ✨ Características Interactivas

### Búsqueda Inteligente
- ⚡ Búsqueda en tiempo real
- 🔍 Autocompletado con información
- ⏱️ Debounce de 300ms
- 📊 Muestra año, duración y género

### Calificación con Estrellas
- 🎯 Click para seleccionar
- 👆 Hover effect
- ✨ Animación bounce
- 💾 Confirmación visual

### Cards Responsivas
- 📱 Grid adaptativo
- 🎨 Hover effects
- 🔄 Transiciones suaves
- 📏 Diseño flexible

## 🚀 Comandos Principales

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview

# Lint
npm run lint
```

## 📈 Próximas Mejoras Sugeridas

- [ ] Sistema de favoritos
- [ ] Comparación entre usuarios
- [ ] Estadísticas personalizadas
- [ ] Filtros avanzados (por año, duración, etc.)
- [ ] Búsqueda por actor/director
- [ ] Modo oscuro
- [ ] Exportar/importar datos
- [ ] Gráficos de estadísticas
- [ ] Listas personalizadas
- [ ] Compartir recomendaciones

## 🎓 Conceptos Aprendidos

✅ React Hooks (useState, useEffect)
✅ Consultas Cypher en Neo4j
✅ Bases de datos de grafos
✅ Algoritmos de recomendación
✅ CSS Variables y temas
✅ Componentes reutilizables
✅ Estado compartido entre componentes
✅ Debouncing en búsquedas
✅ Diseño responsive
✅ UX/UI moderno

---

**Desarrollado con ❤️ usando React + Vite + Neo4j**
