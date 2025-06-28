// routes/epic.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

router.get('/', async (req, res) => {
  try {
    const { data } = await axios.get(`https://api.nasa.gov/EPIC/api/natural?api_key=${NASA_API_KEY}`);
    console.log("Data: ", data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch EPIC data' });
  }
});

module.exports = router;
