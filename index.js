const express = require('express');
const app = express();
const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello, this is a Node.js + Express.js API!' });
});

app.get('/products', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM featured_products');

        // console.log(rows, "rows")

        res.json(rows);
    } catch (error) {
        console.error('Error fetching users', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

