import ListaPeliculas from './components/ListaPeliculas';
import CalificarPelicula from './components/CalificarPelicula';

function App() {
  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>Mi App de Películas Neo4j</h1>
      <CalificarPelicula />
      <hr />
      <ListaPeliculas />
    </div>
  );
}

export default App;