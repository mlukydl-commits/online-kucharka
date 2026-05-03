const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ingredientFolderPath = path.join(__dirname, "storage", "ingredientList");

function get(ingredientId) {
  try {
    const filePath = path.join(ingredientFolderPath, `${ingredientId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadIngredient", message: error.message };
  }
}

function create(ingredient) {
  try {
    ingredient.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(ingredientFolderPath, `${ingredient.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(ingredient), "utf8");
    return ingredient;
  } catch (error) {
    throw { code: "failedToCreateIngredient", message: error.message };
  }
}

function update(ingredient) {
  try {
    const current = get(ingredient.id);
    if (!current) return null;
    const updated = { ...current, ...ingredient };
    const filePath = path.join(ingredientFolderPath, `${ingredient.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(updated), "utf8");
    return updated;
  } catch (error) {
    throw { code: "failedToUpdateIngredient", message: error.message };
  }
}

function remove(ingredientId) {
  try {
    const filePath = path.join(ingredientFolderPath, `${ingredientId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveIngredient", message: error.message };
  }
}

function list() {
  try {
    const files = fs.readdirSync(ingredientFolderPath);
    return files.map((file) => {
      const fileData = fs.readFileSync(path.join(ingredientFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
  } catch (error) {
    throw { code: "failedToListIngredients", message: error.message };
  }
}

module.exports = { get, create, update, remove, list };
