const express = require('express');
const { createCompany, getAllCompany, updatecompany, getCompanyById } = require('../controllers/admcontroller');
const verifyAdminToken = require('../middleware/verifyadmintoken');
const router = express.Router();

router.patch('/admcompany/:id',verifyAdminToken,updatecompany)
router.post('/admcompany',verifyAdminToken,createCompany)
router.get('/admcompany/:id',verifyAdminToken,getCompanyById)
router.get('/admcompany',verifyAdminToken,getAllCompany)

module.exports = router;