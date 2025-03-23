const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Import database connection

// Define a list of stop words (you can expand this list as needed)
const stopWords = [
    "a", "an", "the", "is", "and", "or", "of", "to", "in",
    "on", "with", "for", "by", "this", "that", "it", "at",
    "from", "as", "but", "be"
];

// Function to preprocess the search term
const preprocessSearchTerm = (text) => {
    const tokens = text.toLowerCase().split(" "); // Tokenize and lowercase
    const filteredTokens = tokens.filter((word) => !stopWords.includes(word)); // Remove stop words
    return filteredTokens.join(" | "); // Join remaining tokens with '|' for OR search
};

// POST route for searching projects
router.post('/search', async (req, res) => {
    const { searchTerm, filterColumn } = req.body;

    try {
        // Preprocess the search term for full-text search
        const processedSearchTerm = preprocessSearchTerm(searchTerm);

        let query;
        if (filterColumn === 'all') {
            query = `
                SELECT 
                    project_id,
                    ts_headline('english', title, to_tsquery('english', $1)) AS title,
                    ts_headline('english', keywords, to_tsquery('english', $1)) AS keywords,
                    ts_headline('english', needs_statement, to_tsquery('english', $1)) AS needs_statement,
                    ts_headline('english', solution, to_tsquery('english', $1)) AS solution
                FROM projects
                WHERE to_tsvector('english', 
                    coalesce(title, '') || ' ' ||
                    coalesce(keywords, '') || ' ' ||
                    coalesce(needs_statement, '') || ' ' ||
                    coalesce(solution, '')
                ) @@ to_tsquery('english', $1)
            `;
        } else {
            query = `
                SELECT 
                    project_id,
                    ts_headline('english', ${filterColumn}, to_tsquery('english', $1)) AS ${filterColumn}
                FROM projects
                WHERE ${filterColumn} ILIKE '%' || $1 || '%';
            `;
        }

        const values = [processedSearchTerm];
        const result = await pool.query(query, values);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET route for fetching project details by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'SELECT * FROM projects WHERE project_id = $1';
        const values = [id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Updated GET project details endpoint
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const userRole = req.session.user?.role || 'student';

    try {
        // Get column access setting
        const settingsResult = await pool.query(
            'SELECT setting_value FROM system_settings WHERE setting_key = $1',
            ['column_access_enabled']
        );
        const columnAccessEnabled = settingsResult.rows[0]?.setting_value ?? true;

        const query = `
            SELECT 
                project_id,
                title,
                keywords,
                observation,
                scoping,
                needs_statement,
                state_of_art,
                created_at,
                CASE
                    WHEN $1 = 'student' AND $2 = false 
                    THEN 'Admin has disabled access to this resource'
                    ELSE solution
                END as solution,
                CASE
                    WHEN $1 = 'student' AND $2 = false 
                    THEN 'Admin has disabled access to this resource'
                    ELSE solution_category
                END as solution_category,
                CASE
                    WHEN $1 = 'student' AND $2 = false 
                    THEN 'Admin has disabled access to this resource'
                    ELSE literature
                END as literature,
                CASE
                    WHEN $1 = 'student' AND $2 = false 
                    THEN 'Admin has disabled access to this resource'
                    ELSE acknowledgement
                END as acknowledgement
            FROM projects
            WHERE project_id = $3
        `;

        const result = await pool.query(query, [
            userRole,
            columnAccessEnabled,
            id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
