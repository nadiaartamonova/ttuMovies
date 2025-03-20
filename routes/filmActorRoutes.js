const express = require("express");
const router = express.Router();
const filmActorController = require("../controllers/filmActorController");
const authController = require("../controllers/authController");


router.post("/", authController.authenticate, filmActorController.addActorToFilm);
router.delete("/", authController.authenticate, filmActorController.removeActorFromFilm);

module.exports = router;
