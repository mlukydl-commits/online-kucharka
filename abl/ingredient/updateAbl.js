const Ajv = require("ajv");
const ajv = new Ajv();
const ingredientDao = require("../../dao/ingredient-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    amount: { type: "number" },
    unit: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let ingredient = req.body;

    const valid = ajv.validate(schema, ingredient);
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
      updated = ingredientDao.update(ingredient);
    } catch (e) {
      res.status(400).json({ ...e });
      return;
    }

    if (!updated) {
      res.status(404).json({
        code: "ingredientNotFound",
        message: `Ingredient with id ${ingredient.id} not found`,
      });
      return;
    }

    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
