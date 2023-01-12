const express = require('express');
const router = express.Router();
const works = require('../services/works');

/* GET | /all */
router.get('/info', async function(req, res, next) {
    try {
        res.json(await works.getAll());
    } catch (err) {
        console.error(`Error`, err.message);
        next(err);
    }
});

/* GET | /update */
router.get('/update', async function(req, res, next) {
    try {
        res.json(await works.loadAll());
    } catch (err) {
        console.error(`Error`, err.message);
        next(err);
    }
});

module.exports = router;