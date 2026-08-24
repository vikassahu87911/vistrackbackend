const express = require('express');
const { createCompany, getAllCompany, updatecompany, getCompanyById } = require('../controllers/admcontroller');

const router = express.Router();

router.patch('/admcompany/:id',updatecompany)
router.post('/admcompany',createCompany)
router.get('/admcompany/:id',getCompanyById)
router.get('/admcompany',getAllCompany)

module.exports = router;