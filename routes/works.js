const express = require('express');
const router = express.Router();
const works = require('../services/works');

/* GET | /works */
router.get('/', async function(req, res, next) {
    try {
        let worksInfo = await works.getAll();
        if (worksInfo.length) {
            res.json(worksInfo);
        }
        else {
            res.json({message: "No works founds."});
        }
    } catch (err) {
        console.error(`Error`, err.message);
        next(err);
    }
});

module.exports = router;