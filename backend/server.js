const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

// Crear la conexión a la base de datos
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "INFOMATRIX",
});

connection.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos INFOMATRIX");
});

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta para agregar un nuevo espacio
app.post("/api/espacios", (req, res) => {
  const { codigo, numero_contenedor, tipo_contenedor, tamano_contenedor, peso, descripcion_mercancia } = req.body;

  if (!codigo || !numero_contenedor || !tipo_contenedor || !tamano_contenedor || !peso || !descripcion_mercancia) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // Verificar si el número de contenedor ya existe
  const queryVerificar = "SELECT * FROM espacios WHERE numero_contenedor = ?";
  connection.query(queryVerificar, [numero_contenedor], (err, results) => {
    if (err) {
      console.error("Error al verificar el contenedor:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "El número de contenedor ya existe" });
    }

    // Insertar el nuevo contenedor con estado "ocupado"
    const queryInsertar = `
      INSERT INTO espacios (codigo, numero_contenedor, tipo_contenedor, tamano_contenedor, peso, descripcion_mercancia, estado)
      VALUES (?, ?, ?, ?, ?, ?, 'ocupado')
    `;

    connection.query(
      queryInsertar,
      [codigo, numero_contenedor, tipo_contenedor, tamano_contenedor, peso, descripcion_mercancia],
      (err, results) => {
        if (err) {
          console.error("Error al insertar en la base de datos:", err);
          return res.status(500).json({ error: "Error en el servidor" });
        }
        res.status(201).json({ message: "Espacio agregado y asignado correctamente", id: results.insertId });
      }
    );
  });
});

// Ruta para obtener todos los espacios
app.get("/api/espacios", (req, res) => {
  const query = "SELECT * FROM espacios";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener los espacios:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.status(200).json(results);
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});