const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAllMaterials, uploadMaterial, deleteMaterial, downloadMaterial } = require('../controllers/materialController');

router.get('/', authenticate, getAllMaterials);
router.post('/', authenticate, authorize(['faculty','admin']), upload.single('file'), uploadMaterial);
router.get('/:id/download', authenticate, downloadMaterial);
router.delete('/:id', authenticate, authorize(['faculty','admin']), deleteMaterial);

module.exports = router;
