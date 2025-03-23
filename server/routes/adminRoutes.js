const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all projects
router.get('/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST new project
router.post('/projects', async (req, res) => {
  const { title, keywords, observation, scoping, needs_statement, state_of_art, solution, solution_category, literature, acknowledgement } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO projects (title, keywords, observation, scoping, needs_statement, state_of_art, solution, solution_category, literature, acknowledgement) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [title, keywords, observation, scoping, needs_statement, state_of_art, solution, solution_category, literature, acknowledgement]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update project
router.put('/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { title, keywords, observation, scoping, needs_statement, state_of_art, solution, solution_category, literature, acknowledgement } = req.body;
  try {
    const result = await pool.query(
      'UPDATE projects SET title = $1, keywords = $2, observation = $3, scoping = $4, needs_statement = $5, state_of_art = $6, solution = $7, solution_category = $8, literature = $9, acknowledgement = $10 WHERE project_id = $11 RETURNING *',
      [title, keywords, observation, scoping, needs_statement, state_of_art, solution, solution_category, literature, acknowledgement, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE project
router.delete('/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM projects WHERE project_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
