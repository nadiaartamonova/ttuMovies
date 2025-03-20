exports.addActorToFilm = async (req, res) => {
    const { film_id, actor_id } = req.body;
    if (!film_id || !actor_id) {
        return res.status(400).json({ message: "film_id and actor_id are required" });
    }

    try {
        await models.film_actor.create({ film_id, actor_id });
        res.status(201).json({ message: "Actor added to film" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding actor to film" });
    }
};

exports.removeActorFromFilm = async (req, res) => {
    const { film_id, actor_id } = req.body;
    if (!film_id || !actor_id) {
        return res.status(400).json({ message: "film_id and actor_id are required" });
    }

    try {
        await models.film_actor.destroy({ where: { film_id, actor_id } });
        res.status(200).json({ message: "Actor removed from film" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing actor from film" });
    }
};
