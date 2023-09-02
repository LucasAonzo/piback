const assert = require("assert");
const { Sequelize } = require("sequelize");
const defineVideogameModel = require("../../src/models/videogame");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

describe("Videogame model", function () {
  let sequelize;

  before(function () {
    // Configuración de la conexión a Sequelize y la base de datos de prueba
    sequelize = new Sequelize("videogames", DB_USER, DB_PASSWORD, {
      dialect: "sqlite",
      storage: ":memory:", // Almacenamiento en memoria para pruebas
      host: "localhost",
      dialect: "postgres",
    });

    // Definición del modelo
    defineVideogameModel(sequelize);
  });

  beforeEach(async function () {
    // Sincronización del modelo con la base de datos de prueba antes de cada prueba
    await sequelize.sync({ force: true });
  });

  it("debería crear un nuevo videojuego en la base de datos", async function () {
    const Videogame = sequelize.models.videogame;

    const videogame = await Videogame.create({
      name: "Super Mario Bros",
      description: "Plumber saves princess from evil turtle",
      released: "1985-09-13",
      rating: 4.5,
      platforms: ["NES", "SNES", "Switch"],
      background_image: "https://example.com/image.jpg",
      createdInDb: true,
    });

    assert.strictEqual(videogame.name, "Super Mario Bros");
    assert.strictEqual(videogame.rating, 4.5);
  });

  it("debería retornar un error si el rating está fuera del rango permitido", async function () {
    const Videogame = sequelize.models.videogame;

    try {
      await Videogame.create({
        name: "Super Mario Bros",
        description: "Plumber saves princess from evil turtle",
        released: "1985-09-13",
        rating: 10,
        platforms: ["NES", "SNES", "Switch"],
        background_image: "https://example.com/image.jpg",
        createdInDb: true,
      });
      assert.fail("Se esperaba un error de validación");
    } catch (error) {
      assert.strictEqual(
        error.message,
        "Validation error: Validation max on rating failed"
      );
    }
  });

  it("debería retornar un error si el nombre es nulo", async function () {
    const Videogame = sequelize.models.videogame;

    try {
      await Videogame.create({
        name: null,
        description: "Plumber saves princess from evil turtle",
        released: "1985-09-13",
        rating: 4.5,
        platforms: ["NES", "SNES", "Switch"],
        background_image: "https://example.com/image.jpg",
        createdInDb: true,
      });
      assert.fail("Se esperaba un error de validación");
    } catch (error) {
      assert.strictEqual(
        error.message,
        "notNull Violation: videogame.name cannot be null"
      );
    }
  });

  after(async function () {
    // Cierre de la conexión a la base de datos después de todas las pruebas
    await sequelize.close();
  });
});
