const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languageController');
const authController = require('../controllers/authController');


router.get('/', languageController.getAllLanguages);
router.get('/:id', languageController.getLanguageById);


router.post('/', authController.authenticate, languageController.createLanguage);
router.put('/:id', authController.authenticate, languageController.updateLanguage);
router.delete('/:id', authController.authenticate, languageController.deleteLanguage);

module.exports = router;
