const Ajv = require("ajv");
const ajv = new Ajv();
const ingredientDao = require("../../dao/ingredient-dao.js");

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

    const ingredient = ingredientDao.get(dtoIn.id);
    if (!ingredient) {
      res.status(404).json({
        code: "ingredientNotFound",
        message: `Ingredient with id ${dtoIn.id} not found`,
      });
      return;
    }

    ingredientDao.remove(dtoIn.id);
    res.json({ message: "Ingredient deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeleteAbl;
