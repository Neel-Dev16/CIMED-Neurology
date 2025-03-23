const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Add a new document for a project
router.post('/', async (req, res) => {
    const { projectId, documentName, filePath } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO projectdocuments (project_id, document_name, file_path) VALUES ($1, $2, $3) RETURNING *',
            [projectId, documentName, filePath]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.stack); // Detailed error logging
        res.status(500).json({ error: err.message });
    }
});


// Get all documents for a project
router.get('/:projectId', async (req, res) => {
    const { projectId } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM projectdocuments WHERE project_id = $1',
            [projectId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
