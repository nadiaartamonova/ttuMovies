const db = require('../config/database')
const initModels = require("../models/init-models")
const models = initModels(db)


exports.ignoreFavicon = (req, res, next) => {
    if (req.originalUrl === "/favicon.ico") {
        return res.status(204).end();
    }
    next();
};

// Get all movie categories
exports.getAllCategories = async (req, res) => {
try {
const categories = await models.category.findAll()
res
    .status(200)
    .json(categories)
} catch (error) {
    console.error(error)
    res
        .status(500)
        .json({ message: 'An error occurred while fetching movie categories' })
    }
} 

exports.createCategory = async (req, res) => {
    const { name } = req.body
    try {
    const category = await models.category.create({ name })
        res
            .status(201)
            .json(category)
    } catch (error) {
    console.error(error)
    res
        .status(500)
        .json({ message: 'An error occurred while creating a movie category' })
    }
}

exports.getCategoryById = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res
            .status(400)
            .json({ message: "Invalid category ID" });
    }

    try {
        const category = await models.category.findByPk(id)
        
        if (!category) {
            return res.status(404).json({ message: 'Movie category not found' })
        }
        res
            .status(200)
            .json(category)
    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'An error occurred while fetching movie category information' })
    }
}

// Update movie category information
exports.updateCategory = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body

    if (isNaN(id)) {
        return res
            .status(400)
            .json({ message: "Invalid category ID" });
    }
    
    if (!name || typeof name !== "string") {
        return res
            .status(400)
            .json({ message: "Invalid category name" });
    }

    try {
        const category = await models.category.findByPk(id)
        
        if (!category) {
            return res
                .status(404)
                .json({ message: 'Movie category not found' })
        }

        await category.update({ name })
        res
            .status(200)
            .json(category)

    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'An error occurred while updating movie category' })
    }
}

 // Delete a movie category
exports.deleteCategory = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
    }
    
    try {
        const category = await models.category.findByPk(id)
        
        if (!category) {
            return res.status(404).json({ message: 'Movie category not found' })
        }

        await category.destroy()
        res.status(204).json()
    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'An error occurred while deleting movie category' })
        }
} 