const express = require("express");
const cors = require("cors");
const app = express();
const port = 8888;

const recipeController = require("./controller/recipe");
const ingredientController = require("./controller/ingredient");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Online Kucharka API");
});

app.use("/recipe", recipeController);
app.use("/ingredient", ingredientController);

app.listen(port, () => {
  console.log(`Online Kucharka bezi na porte ${port}`);
});
