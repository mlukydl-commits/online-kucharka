const ingredientDao = require("../../dao/ingredient-dao.js");

async function ListAbl(req, res) {
  try {
    const ingredientList = ingredientDao.list();
    res.json({ ingredientList });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
