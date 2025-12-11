import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  "bolt://localhost:7687", 
  neo4j.auth.basic("neo4j", "kacCHAN7$7"),
  {
    encrypted: "ENCRYPTION_OFF" // Desactivar cifrado para desarrollo local
  }
);

export const runQuery = async (cypher, params = {}) => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run(cypher, params);
    return result.records;
  } catch (error) {
    console.error("Error en Neo4j:", error);
    throw error;
  } finally {
    await session.close();
  }
};

export default driver;