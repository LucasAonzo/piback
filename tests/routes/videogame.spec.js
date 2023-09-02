const { expect } = require("chai");
const request = require("supertest");
const express = require("express");
const app = express();

// Importa las funciones de controlador necesarias
const {
  getGames,
  gameDetail,
  createGame,
} = require("../../src/controllers/getVideogames");

// Importa el enrutador que contiene las rutas
const router = require("../../src/routes/gamesRoute");

// Crea un middleware para parsear el body de las respuestas
app.use(express.json());

// Monta el enrutador en la aplicación
app.use("/videogames", router);

// Crea un middleware para manejar los errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

describe("GET /videogames", function () {
  this.timeout(9000); // delay porque si no da error

  it("debería retornar un array de 100 videojuegos", async function () {
    const response = await request(app).get("/videogames");
    expect(response.status).to.eql(200);
    expect(response.body).to.have.lengthOf(100);
  });
});

describe("POST /videogames", function () {
  this.timeout(9000); // delay porque si no da error

  it("debería crear un nuevo videojuego", async function () {
    const response = await request(app)
      .post("/videogames")
      .send({
        name: "Super Mario Bros",
        description: "Plumber saves princess from evil turtle",
        released: "1985-09-13",
        rating: 4.5,
        genres: ["Action", "Adventure", "Open World"],
        platforms: ["Nintendo Switch", "Wii U"],
        background_image: "https://example.com/image.jpg",
        createdInDb: true,
      });
    expect(response.status).to.eql(201);
    expect(response.body.name).to.eql("Super Mario Bros");
  });
});
