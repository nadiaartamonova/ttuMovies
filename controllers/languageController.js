const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);

// Получение всех языков
exports.getAllLanguages = async (req, res) => {
    try {
        const languages = await models.language.findAll();
        res.status(200).json(languages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching languages" });
    }
};

// Получение языка по ID
exports.getLanguageById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid language ID" });

    try {
        const language = await models.language.findByPk(id);
        if (!language) return res.status(404).json({ message: "Language not found" });
        res.status(200).json(language);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching language" });
    }
};

// Создание нового языка
exports.createLanguage = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Language name is required" });

    try {
        const newLanguage = await models.language.create({ name });
        res.status(201).json(newLanguage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating a language" });
    }
};

// Обновление языка
exports.updateLanguage = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;

    if (isNaN(id)) return res.status(400).json({ message: "Invalid language ID" });
    if (!name) return res.status(400).json({ message: "Language name is required" });

    try {
        const language = await models.language.findByPk(id);
        if (!language) return res.status(404).json({ message: "Language not found" });

        await language.update({ name });
        res.status(200).json(language);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the language" });
    }
};

// Удаление языка
exports.deleteLanguage = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid language ID" });

    try {
        const language = await models.language.findByPk(id);
        if (!language) return res.status(404).json({ message: "Language not found" });

        await language.destroy();
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the language" });
    }
};
