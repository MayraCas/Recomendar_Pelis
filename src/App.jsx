import { useState } from 'react';
import './App.css';
import SelectorUsuario from './components/SelectorUsuario';
import RecomendacionesPeliculas from './components/RecomendacionesPeliculas';
import ListaPeliculas from './components/ListaPeliculas';
import CalificarPelicula from './components/CalificarPelicula';
import HistorialUsuario from './components/HistorialUsuario';
import AdminPeliculas from './components/AdminPeliculas';

function App() {
  const [usuarioActual, setUsuarioActual] = useState('Juan');
  const [actualizarRecomendaciones, setActualizarRecomendaciones] = useState(0);
  const [modoAdmin, setModoAdmin] = useState(false);

  const handleCalificacionGuardada = () => {
    // Forzar actualización de recomendaciones y historial
    setActualizarRecomendaciones(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎬 CineMatch</h1>
        <p>Tu sistema de recomendación de películas personalizado</p>
        
        {/* Toggle modo Admin/Usuario */}
        <div className="role-selector">
          <button 
            className={!modoAdmin ? 'role-btn active' : 'role-btn'}
            onClick={() => setModoAdmin(false)}
          >
            👤 Usuario
          </button>
          <button 
            className={modoAdmin ? 'role-btn active' : 'role-btn'}
            onClick={() => setModoAdmin(true)}
          >
            🛠️ Admin
          </button>
        </div>
      </header>

      <div className="app-container">
        {modoAdmin ? (
          /* Vista de Administrador */
          <section className="section">
            <AdminPeliculas />
          </section>
        ) : (
          /* Vista de Usuario Normal */
          <>
            {/* Selector de Usuario */}
            <SelectorUsuario 
              usuarioActual={usuarioActual}
              onCambiarUsuario={setUsuarioActual}
            />

            {/* Sección de Recomendaciones */}
            <section className="section">
              <RecomendacionesPeliculas 
                usuario={usuarioActual} 
                key={`rec-${actualizarRecomendaciones}`}
              />
            </section>

            {/* Grid con Calificar y Historial */}
            <div className="grid-2">
              <section className="section">
                <CalificarPelicula 
                  usuario={usuarioActual}
                  onCalificacionGuardada={handleCalificacionGuardada}
                />
              </section>

              <section className="section">
                <HistorialUsuario 
                  usuario={usuarioActual}
                  key={`hist-${actualizarRecomendaciones}`}
                />
              </section>
            </div>

            {/* Catálogo completo */}
            <section className="section">
              <ListaPeliculas />
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default App;