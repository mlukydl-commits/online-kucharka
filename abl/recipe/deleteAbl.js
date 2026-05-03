const Ajv = require("ajv");
const ajv = new Ajv();
const recipeDao = require("../../dao/recipe-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function DeleteAbl(req, res) {
  try {
    let dtoIn = req.body;

    const valid = ajv.validate(schema, dtoIn);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const recipe = recipeDao.get(dtoIn.id);
    if (!recipe) {
      res.status(404).json({
        code: "recipeNotFound",
        message: `Recipe with id ${dtoIn.id} not found`,
      });
      return;
    }

    // pozn: ingrediencie sa nemažú, len väzba v recepte zanikne
    recipeDao.remove(dtoIn.id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeleteAbl;
