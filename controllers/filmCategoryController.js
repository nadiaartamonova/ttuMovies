exports.addCategoryToFilm = async (req, res) => {
    const { film_id, category_id } = req.body;
    if (!film_id || !category_id) {
        return res.status(400).json({ message: "film_id and category_id are required" });
    }

    try {
        await models.film_category.create({ film_id, category_id });
        res.status(201).json({ message: "Category added to film" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding category to film" });
    }
};

exports.removeCategoryFromFilm = async (req, res) => {
    const { film_id, category_id } = req.body;
    if (!film_id || !category_id) {
        return res.status(400).json({ message: "film_id and category_id are required" });
    }

    try {
        await models.film_category.destroy({ where: { film_id, category_id } });
        res.status(200).json({ message: "Category removed from film" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing category from film" });
    }
};
