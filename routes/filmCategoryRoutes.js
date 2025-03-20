const express = require("express");
const router = express.Router();
const filmCategoryController = require("../controllers/filmCategoryController");
const authController = require("../controllers/authController");


router.post("/", authController.authenticate, filmCategoryController.addCategoryToFilm);
router.delete("/", authController.authenticate, filmCategoryController.removeCategoryFromFilm);

module.exports = router;

