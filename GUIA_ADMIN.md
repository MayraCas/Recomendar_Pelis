# 🛠️ Guía de Uso - Panel de Administración

## Cómo acceder al Panel Admin

1. En la parte superior de la aplicación, encontrarás dos botones:
   - **👤 Usuario** - Vista normal de usuario
   - **🛠️ Admin** - Panel de administración

2. Haz clic en **🛠️ Admin** para acceder al panel de administración

## Funcionalidades CRUD

### ➕ Crear una Nueva Película

1. En el formulario superior, completa:
   - **Título** (requerido)
   - **Año** (por defecto el año actual)
   - **Duración** en minutos
   - **Géneros** (selecciona uno o varios)

2. Haz clic en **➕ Crear**

3. La película se agregará a la base de datos y aparecerá en la lista

### ✏️ Editar una Película

1. En la tabla de películas, localiza la película que deseas editar

2. Haz clic en el botón **✏️** (editar)

3. El formulario se llenará con los datos actuales

4. Modifica los campos que necesites

5. Haz clic en **💾 Actualizar**

6. Para cancelar la edición, haz clic en **❌ Cancelar**

### 🗑️ Eliminar una Película

1. En la tabla de películas, localiza la película que deseas eliminar

2. Haz clic en el botón **🗑️** (eliminar)

3. Confirma la eliminación en el diálogo que aparece

4. La película será eliminada de la base de datos

**⚠️ Nota**: Al eliminar una película, también se eliminarán todas sus relaciones (géneros, calificaciones, etc.)

## Características del Panel Admin

### Formulario Inteligente
- ✅ Validación de campos requeridos
- ✅ Valores por defecto (año actual, 90 minutos)
- ✅ Selección múltiple de géneros
- ✅ Modo crear/editar automático

### Tabla Interactiva
- 📊 Vista completa de todas las películas
- 🎭 Visualización de géneros asociados
- ⚡ Acciones rápidas (editar/eliminar)
- 📱 Responsive en móviles

### Mensajes de Confirmación
- ✅ Confirmación de creación exitosa
- ✅ Confirmación de actualización
- ✅ Confirmación de eliminación
- ❌ Mensajes de error si algo falla

## Consejos de Uso

### Al Crear Películas
- Verifica que el título no exista ya en la base de datos
- Selecciona al menos un género para mejor categorización
- La duración típica de películas está entre 80-180 minutos

### Al Editar Películas
- Puedes cambiar el título, pero ten cuidado ya que es el identificador único
- Si cambias el título, las calificaciones existentes se mantendrán asociadas
- Puedes agregar o quitar géneros libremente

### Al Eliminar Películas
- La eliminación es permanente
- Se eliminarán todas las calificaciones de usuarios asociadas
- Confirma bien antes de eliminar

## Géneros Disponibles

Los géneros actuales en el sistema son:
- Acción
- Comedia
- Drama
- Ciencia Ficción
- Terror
- Aventura
- Fantasía
- Romance
- Animación
- Superhéroes

Para agregar nuevos géneros, ejecuta en Neo4j Browser:
```cypher
MERGE (:Genero {nombre: 'Nombre del Nuevo Género'})
```

## Integración con Vista de Usuario

Las películas que crees/edites/elimines en el panel admin se reflejarán inmediatamente en:
- 🎥 Catálogo de Películas
- 🔍 Búsqueda de Películas
- ⭐ Sistema de Calificación
- 🎬 Sistema de Recomendaciones

**Nota**: Para ver los cambios, es posible que necesites:
- Cambiar a vista de usuario
- Refrescar la página si es necesario

## Ejemplos de Uso

### Crear una película nueva
```
Título: Spider-Man: Into the Spider-Verse
Año: 2018
Duración: 117
Géneros: [✓] Animación [✓] Acción [✓] Aventura
```

### Editar película existente
```
1. Buscar "Matrix" en la tabla
2. Clic en ✏️
3. Cambiar duración de 136 a 138
4. Agregar género "Acción" si no lo tiene
5. Clic en 💾 Actualizar
```

## Solución de Problemas

### "Error al guardar la película"
- Verifica la conexión con Neo4j
- Asegúrate que el título no esté vacío
- Revisa que el año y duración sean números válidos

### La película no aparece después de crearla
- Espera unos segundos
- La lista se recarga automáticamente
- Si no aparece, refresca la página

### No puedo eliminar una película
- Verifica que tengas permisos en Neo4j
- La base de datos debe estar corriendo
- Confirma la operación en el diálogo

---

¡Disfruta administrando tu catálogo de películas! 🎬✨
