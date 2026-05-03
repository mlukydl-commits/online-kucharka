const Ajv = require("ajv");
const ajv = new Ajv();
const recipeDao = require("../../dao/recipe-dao.js");
const ingredientDao = require("../../dao/ingredient-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetAbl(req, res) {
  try {
    const dtoIn = req.query;

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

    // načítaj plné objekty ingrediencií podľa ingredientIds
    const ingredientList = recipe.ingredientIds
      .map((id) => ingredientDao.get(id))
      .filter((i) => i !== null);

    res.json({ ...recipe, ingredientList });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
