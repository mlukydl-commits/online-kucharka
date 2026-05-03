const Ajv = require("ajv");
const ajv = new Ajv();
const recipeDao = require("../../dao/recipe-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    instructions: { type: "string" },
    category: { type: "string" },
    preparationTime: { type: "number" },
    ingredientIds: { type: "array", items: { type: "string" } },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let recipe = req.body;

    const valid = ajv.validate(schema, recipe);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    let updated;
    try {
      updated = recipeDao.update(recipe);
    } catch (e) {
      res.status(400).json({ ...e });
      return;
    }

    if (!updated) {
      res.status(404).json({
        code: "recipeNotFound",
        message: `Recipe with id ${recipe.id} not found`,
      });
      return;
    }

    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
