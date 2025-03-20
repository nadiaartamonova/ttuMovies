const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');


router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);


router.post('/', authController.authenticate, categoryController.createCategory);
router.put('/:id', authController.authenticate, categoryController.updateCategory);
router.delete('/:id', authController.authenticate, categoryController.deleteCategory);

module.exports = router;
