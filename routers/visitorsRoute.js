const express = require('express');
const { createVisitor, getAllVisitors, deleteVisitorbyId, updateVisitorById, getVisitorById } = require('../controllers/visitorsController');
const router = express.Router();


router.post('/visitors',createVisitor)

router.get('/visitors/:id', getVisitorById)

router.get('/visitors/company/:orgid', getAllVisitors)

router.delete('/visitors/:id',deleteVisitorbyId)

router.patch('/visitors/:id',updateVisitorById)

module.exports = router;