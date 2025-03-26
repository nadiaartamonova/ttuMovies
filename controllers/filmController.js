const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);

const sequelize = require('../config/database');


// Получение всех фильмов
exports.getAllFilms = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;  
        const size = parseInt(req.query.size) || 100; 


        const offset = (page - 1) * size;


        const films = await models.film.findAll({

            order: [["film_id", "ASC"]], 
            limit: size, 
            offset: offset, 
        });

        res.status(200).json({
            page,
            size,
            total: films.length, 
            films
        });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "An error fetching films" });
    }
};
//олучение фильма по ID
exports.getFilmById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid film ID" });

    try {
        const film = await models.film.findByPk(id);
        if (!film) return res.status(404).json({ message: "Film not found" });
        res.status(200).json(film);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching film" });
    }
};


exports.createFilm = async (req, res) => {
    const { title, release_year, language_id, actor_ids, category_ids } = req.body;

    if (!title || !language_id || !release_year) {
        return res.status(400).json({ message: "Title, language, and year are required" });
    }
    if (!actor_ids || !Array.isArray(actor_ids) || actor_ids.length === 0) {
        return res.status(400).json({ message: "At least one actor_id is required" });
    }
    if (!category_ids || !Array.isArray(category_ids) || category_ids.length === 0) {
        return res.status(400).json({ message: "At least one category_id is required" });
    }

    const transaction = await sequelize.transaction();


    try {
        const newFilm = await models.film.create({
            title,
            release_year,
            language_id
        }, { transaction });

        const filmActors = actor_ids.map(actor_id => ({
            film_id: newFilm.film_id,
            actor_id
        }));
        await models.film_actor.bulkCreate(filmActors, { transaction });

        const filmCategories = category_ids.map(category_id => ({
            film_id: newFilm.film_id,
            category_id
        }));
        await models.film_category.bulkCreate(filmCategories, { transaction });

        await transaction.commit(); 

        res.status(201).json({
            message: "Film created successfully",
            film: newFilm,
            actors: actor_ids,
            categories: category_ids
        });
    } catch (error) {
        await transaction.rollback(); 
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the film" });
    }
};


// Обновление фильма
exports.updateFilm = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { title, release_year, language_id, actor_ids, category_ids } = req.body;

    if (isNaN(id)) return res.status(400).json({ message: "Invalid film ID" });

    const transaction = await sequelize.transaction();
 

    try {
        const film = await models.film.findByPk(id, { transaction });
        if (!film) {
            await transaction.rollback();
            return res.status(404).json({ message: "Film not found" });
        }

        await film.update(
            { title, release_year, language_id },
            { transaction }
        );


        if (actor_ids && Array.isArray(actor_ids)) {
            await models.film_actor.destroy({ where: { film_id: id }, transaction });
            const filmActors = actor_ids.map(actor_id => ({ film_id: id, actor_id }));
            await models.film_actor.bulkCreate(filmActors, { transaction });
        }


        if (category_ids && Array.isArray(category_ids)) {
            await models.film_category.destroy({ where: { film_id: id }, transaction });
            const filmCategories = category_ids.map(category_id => ({ film_id: id, category_id }));
            await models.film_category.bulkCreate(filmCategories, { transaction });
        }

        await transaction.commit(); 

        res.status(200).json({
            message: "Film updated successfully",
            film,
            actors: actor_ids || "Not updated",
            categories: category_ids || "Not updated"
        });
    } catch (error) {
        await transaction.rollback(); 
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the film" });
    }
};



// Удаление фильма
exports.deleteFilm = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid film ID" });

    try {

        const film = await models.film.findByPk(id);
        if (!film) return res.status(404).json({ message: "Film not found" });

        await models.film_actor.destroy({ where: { film_id: id } });


        await models.film_category.destroy({ where: { film_id: id } });


        await film.destroy();

        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the film" });
    }
};


//http://localhost:3000/films/search/title?title=Academy&sortBy=rental_rate&order=DESC
//http://localhost:3000/films/search/language?language=English&sortBy=film_id&order=ASC


exports.searchFilmByTitle = async (req, res) => {
    const { title, sortBy = "title", order = "ASC" } = req.query;
    if (!title) return res.status(400).json({ message: "Title parameter is required" });

    const validSortFields = ["title", "release_year", "rental_rate", "length", "film_id"];
    if (!validSortFields.includes(sortBy)) return res.status(400).json({ message: "Invalid sort field" });

    try {
        const films = await models.film.findAll({
            where: {
                title: { [Op.iLike]: `%${title}%` }
            },
            order: [[sortBy, order.toUpperCase()]]
        });

        res.status(200).json(films);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while searching for films" });
    }
};


//http://localhost:3000/films/search/actor?actor=Nick
//http://localhost:3000/films/search/actor?actor=MARY KEITEL
//http://localhost:3000/films/search/actor?actor=MARY&sortBy=length&order=ASC


const { Op } = require("sequelize");


exports.searchFilmByActor = async (req, res) => {
    const { actor, sortBy = "title", order = "ASC" } = req.query;
    if (!actor) return res.status(400).json({ message: "Actor parameter is required" });

    const validSortFields = ["title", "release_year", "rental_rate", "length", "film_id"];
    if (!validSortFields.includes(sortBy)) return res.status(400).json({ message: "Invalid sort field" });

    try {
        const actorParts = actor.trim().split(" "); 

        let actorQuery = {}; 

        if (actorParts.length === 2) {
            //  имя + фамилия
            actorQuery = {
                first_name: { [Op.iLike]: `%${actorParts[0]}%` },
                last_name: { [Op.iLike]: `%${actorParts[1]}%` }
            };
        } else {
            // только одно слово 
            actorQuery = {
                [Op.or]: [
                    { first_name: { [Op.iLike]: `%${actor}%` } },
                    { last_name: { [Op.iLike]: `%${actor}%` } }
                ]
            };
        }

        const films = await models.film.findAll({
            include: [
                {
                    model: models.actor,
                    as: "actor_id_actors",
                    where: actorQuery,
                    attributes: []
                }
            ],
            order: [[sortBy, order.toUpperCase()]],
            raw: true
        });

        res.status(200).json(films);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while searching for films by actor" });
    }
};



//http://localhost:3000/films/search/language?language=Italian


exports.searchFilmByLanguage = async (req, res) => {
    const { language } = req.query;
    if (!language) return res.status(400).json({ message: "Language parameter is required" });

    try {
        const films = await models.film.findAll({
            include: [
                {
                    model: models.language,
                    as: "language",
                    where: { name: { [Op.iLike]: `%${language}%` } },
                    attributes: []
                }
            ],
            raw: true
        });

        res.status(200).json(films);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while searching for films by language" });
    }
};


//http://localhost:3000/films/search/category?category=Action

exports.searchFilmByCategory = async (req, res) => {
    const { category } = req.query;
    if (!category) return res.status(400).json({ message: "Category parameter is required" });

    try {
        const films = await models.film.findAll({
            include: [
                {
                    model: models.category,
                    as: "category_id_categories",
                    where: { name: { [Op.iLike]: `%${category}%` } },
                    attributes: []
                }
            ],
            raw: true
        });

        res.status(200).json(films);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while searching for films by category" });
    }
};

//http://localhost:3000/films/actors?film_id=5

exports.getActorsByFilm = async (req, res) => {
    const { film_id } = req.query;
    if (!film_id) return res.status(400).json({ message: "Film ID is required" });

    try {
        const actors = await models.actor.findAll({
            include: [
                {
                    model: models.film,
                    as: "film_id_films",
                    where: { film_id: film_id },
                    attributes: []
                }
            ],
            raw: true
        });

        res.status(200).json(actors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching actors for the film" });
    }
};

