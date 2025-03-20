const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);

// Получение всех актёров
exports.getAllActors = async (req, res) => {
    try {
        const actors = await models.actor.findAll();
        res.status(200).json(actors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching actors" });
    }
};

// Получение актёра по ID
exports.getActorById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid actor ID" });

    try {
        const actor = await models.actor.findByPk(id);
        if (!actor) return res.status(404).json({ message: "Actor not found" });
        res.status(200).json(actor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching actor" });
    }
};

// Создание нового актёра
exports.createActor = async (req, res) => {
    const { first_name, last_name } = req.body;
    if (!first_name || !last_name) return res.status(400).json({ message: "Missing required fields" });

    try {
        const newActor = await models.actor.create({ first_name, last_name });
        res.status(201).json(newActor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating an actor" });
    }
};

// Обновление актёра
exports.updateActor = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { first_name, last_name } = req.body;

    if (isNaN(id)) return res.status(400).json({ message: "Invalid actor ID" });

    try {
        const actor = await models.actor.findByPk(id);
        if (!actor) return res.status(404).json({ message: "Actor not found" });

        await actor.update({ first_name, last_name });
        res.status(200).json(actor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the actor" });
    }
};

// Удаление актёра
exports.deleteActor = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid actor ID" });

    try {
        const actor = await models.actor.findByPk(id);
        if (!actor) return res.status(404).json({ message: "Actor not found" });

        await actor.destroy();
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the actor" });
    }
};

