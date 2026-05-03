const Ajv = require("ajv");
const ajv = new Ajv();
const ingredientDao = require("../../dao/ingredient-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    amount: { type: "number" },
    unit: { type: "string" },
  },
  required: ["name", "amount", "unit"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
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

    const created = ingredientDao.create(ingredient);
    res.json(created);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
