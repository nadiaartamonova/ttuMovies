const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');
const authController = require('../controllers/authController');


router.get('/', actorController.getAllActors);
router.get('/:id', actorController.getActorById);


router.post('/', authController.authenticate, actorController.createActor);
router.put('/:id', authController.authenticate, actorController.updateActor);
router.delete('/:id', authController.authenticate, actorController.deleteActor);

module.exports = router;
