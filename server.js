const express = require('express');
const pool = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Get all flavors
app.get('/api/flavors', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM flavors');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching flavors', err);
        res.status(500).send('Internal Server Error');
    }
});

// Get a single flavor by ID
app.get('/api/flavors/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM flavors WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Flavor not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching flavor', err);
        res.status(500).send('Internal Server Error');
    }
});

