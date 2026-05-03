const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const recipeFolderPath = path.join(__dirname, "storage", "recipeList");

function get(recipeId) {
  try {
    const filePath = path.join(recipeFolderPath, `${recipeId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadRecipe", message: error.message };
  }
}

function create(recipe) {
  try {
    recipe.id = crypto.randomBytes(16).toString("hex");
    // ingredientIds je pole ID ingrediencii priradených k receptu
    if (!recipe.ingredientIds) recipe.ingredientIds = [];
    const filePath = path.join(recipeFolderPath, `${recipe.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(recipe), "utf8");
    return recipe;
  } catch (error) {
    throw { code: "failedToCreateRecipe", message: error.message };
  }
}

function update(recipe) {
  try {
    const current = get(recipe.id);
    if (!current) return null;
    const updated = { ...current, ...recipe };
    const filePath = path.join(recipeFolderPath, `${recipe.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(updated), "utf8");
    return updated;
  } catch (error) {
    throw { code: "failedToUpdateRecipe", message: error.message };
  }
}

function remove(recipeId) {
  try {
    const filePath = path.join(recipeFolderPath, `${recipeId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveRecipe", message: error.message };
  }
}

function list() {
  try {
    const files = fs.readdirSync(recipeFolderPath);
    return files.map((file) => {
      const fileData = fs.readFileSync(path.join(recipeFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
  } catch (error) {
    throw { code: "failedToListRecipes", message: error.message };
  }
}

// pridá ingredienciu k receptu
function addIngredient(recipeId, ingredientId) {
  try {
    const recipe = get(recipeId);
    if (!recipe) return null;
    if (!recipe.ingredientIds.includes(ingredientId)) {
      recipe.ingredientIds.push(ingredientId);
    }
    const filePath = path.join(recipeFolderPath, `${recipeId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(recipe), "utf8");
    return recipe;
  } catch (error) {
    throw { code: "failedToAddIngredient", message: error.message };
  }
}

// odoberie ingredienciu z receptu
function removeIngredient(recipeId, ingredientId) {
  try {
    const recipe = get(recipeId);
    if (!recipe) return null;
    recipe.ingredientIds = recipe.ingredientIds.filter((id) => id !== ingredientId);
    const filePath = path.join(recipeFolderPath, `${recipeId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(recipe), "utf8");
    return recipe;
  } catch (error) {
    throw { code: "failedToRemoveIngredient", message: error.message };
  }
}

module.exports = { get, create, update, remove, list, addIngredient, removeIngredient };
