const express = require("express");
const router = express.Router();
const filmController = require("../controllers/filmController");
const authController = require("../controllers/authController");


router.get("/", filmController.getAllFilms);
router.get("/search/title", filmController.searchFilmByTitle);
router.get("/search/actor", filmController.searchFilmByActor);
router.get("/search/language", filmController.searchFilmByLanguage);
router.get("/search/category", filmController.searchFilmByCategory);
router.get("/actors", filmController.getActorsByFilm);
router.get("/:id", filmController.getFilmById);


router.post("/", authController.authenticate, filmController.createFilm);
router.put("/:id", authController.authenticate, filmController.updateFilm);
router.delete("/:id", authController.authenticate, filmController.deleteFilm);

module.exports = router;
