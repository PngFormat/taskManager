const express = require("express");
const FocusStat = require("../models/FocusStat")

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const stat = new FocusStat(req.body);
        await stat.save();
        res.status(201).json(stat);
    } catch ( err ) {
        res.status(500).json({error : err.message });
    }
})

module.exports = router;