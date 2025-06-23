const express = require('express');
const axios = require('axios');
const router = express.Router();

const APOD_URL = "https://api.nasa.gov/planetary/apod"
const NASA_API_KEY = process.env.NASA_API_KEY

// Get APOD
router.get('/', async(req, res) => {
    try {
        const response = await axios.get(APOD_URL, {
            params: {
                api_key: NASA_API_KEY,
                count: 2
            }
        });
        res.json(response.data);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: "Failed to fetch data from APOD API"});

    }
});

module.exports = router;

