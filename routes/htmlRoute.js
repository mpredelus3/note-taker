const express = require('express');
const path = require('path');
const router = express.Router();

// route handler for "/notes" path\
router.get('/notes', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/notes.html'));
});

// route handler for all other paths
router.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

module.exports = router;