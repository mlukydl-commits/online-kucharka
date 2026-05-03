const Ajv = require("ajv");
const ajv = new Ajv();
const recipeDao = require("../../dao/recipe-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    instructions: { type: "string" },
    category: { type: "string" },
    preparationTime: { type: "number" },
    ingredientIds: { type: "array", items: { type: "string" } },
  },
  required: ["name", "instructions"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
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

    const created = recipeDao.create(recipe);
    res.json(created);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
