const express = require('express');
const { createVisitor, getAllVisitors, deleteVisitorbyId, updateVisitorById, getVisitorById, verifyQR } = require('../controllers/visitorsController');
const verifyManagerToken = require('../middleware/verifymanagertoken');
const verifyManagerSecurityToken = require('../middleware/verifymanagersecuritytoken');
const verifyManagerVisitorToken = require('../middleware/verifymanagervisitortoken');
const router = express.Router();
  
router.post('/visitors',verifyManagerToken,createVisitor)

router.get('/visitors/:id',verifyManagerVisitorToken, getVisitorById)

router.get('/visitors/company/:orgid',verifyManagerSecurityToken, getAllVisitors)

router.delete('/visitors/:id',verifyManagerToken,deleteVisitorbyId)

router.patch('/visitors/:id',verifyManagerSecurityToken,updateVisitorById)

router.post(
    "/visitors/verify-qr",
    verifyQR
);

module.exports = router;