const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/ingredient/getAbl");
const ListAbl = require("../abl/ingredient/listAbl");
const CreateAbl = require("../abl/ingredient/createAbl");
const UpdateAbl = require("../abl/ingredient/updateAbl");
const DeleteAbl = require("../abl/ingredient/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
