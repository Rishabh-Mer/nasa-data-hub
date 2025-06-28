const express = require('express');
const axios = require('axios');
const router = express.Router();

const APOD_URL = "https://api.nasa.gov/planetary/apod";
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

// Get APOD for current date
router.get('/', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const response = await axios.get(APOD_URL, {
            params: {
                api_key: NASA_API_KEY,
                date: today,
            }
        });
        res.json([response.data]); // Return as array for consistency
    } catch (error) {
        console.error('APOD API Error:', error.message);
        res.status(500).json({ 
            error: "Failed to fetch today's APOD",
            details: error.message 
        });
    }
});

module.exports = router;