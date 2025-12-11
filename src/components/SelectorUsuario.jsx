// src/components/SelectorUsuario.jsx
import React, { useState, useEffect } from 'react';
import { runQuery } from '../neo4j';
import './SelectorUsuario.css';

const SelectorUsuario = ({ usuarioActual, onCambiarUsuario }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const cypher = `
          MATCH (u:Usuario)
          RETURN u.nombre as nombre, u.edad as edad, u.email as email
          ORDER BY u.nombre ASC
        `;
        const records = await runQuery(cypher);
        const usuariosData = records.map(record => {
          const edadValue = record.get('edad');
          
          return {
            nombre: record.get('nombre'),
            edad: typeof edadValue === 'object' && edadValue.toNumber ? edadValue.toNumber() : edadValue,
            email: record.get('email')
          };
        });
        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
      setCargando(false);
    };

    cargarUsuarios();
  }, []);

  if (cargando) {
    return <div className="selector-usuario">Cargando usuarios...</div>;
  }

  return (
    <div className="selector-usuario">
      <label htmlFor="usuario-select">
        <span className="usuario-icon">👤</span>
        Usuario actual:
      </label>
      <select
        id="usuario-select"
        value={usuarioActual}
        onChange={(e) => onCambiarUsuario(e.target.value)}
        className="usuario-select"
      >
        {usuarios.map((usuario) => (
          <option key={usuario.nombre} value={usuario.nombre}>
            {usuario.nombre} ({usuario.edad} años)
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectorUsuario;
