const express = require('express');
const store = require('../db/store');
const router = express.Router();

// helper function to handle async route handlers
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// GET "/api/notes" 
router.get('/notes', asyncHandler(async (req, res) => {
    const notes = await store.getNotes();
    res.json(notes);
}));

// POST "/api/notes"
router.post('/notes', asyncHandler(async (req, res) => {
    const note = await store.addNote(req.body);
    res.json(note);
}));

// DELETE "/api/notes/:id"
router.delete('/notes/:id', async (req, res) => {
    await store.removeNote(req.params.id);
    res.json({ ok: true });
});

// error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = router;