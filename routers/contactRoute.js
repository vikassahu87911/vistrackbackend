const express = require('express');
const router = express.Router();
const {getallcontacts, createcontact} = require('../controllers/contactcontroller');
router.get('/login/adm/contact',getallcontacts)
router.post('/contact/info',createcontact)

module.exports = router