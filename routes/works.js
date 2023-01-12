const express = require('express');
const router = express.Router();
const works = require('../services/works');

/* GET | /works/get/all */
router.get('/get/all', async function(req, res, next) {
    try {
        res.json(await works.getAll());
    } catch (err) {
        console.error(`Error`, err.message);
        next(err);
    }
});

/* GET | /works/manage/update */
router.get('/manage/update', async function(req, res, next) {
    try {
        res.json(await works.loadAll());
    } catch (err) {
        console.error(`Error`, err.message);
        next(err);
    }
});

module.exports = router;