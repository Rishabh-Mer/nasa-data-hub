const express = require("express");
const axios = require("axios");
const router = express.Router();

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

const VALID_ROVERS = ['curiosity', 'opportunity', 'spirit', 'perseverance'];

router.get("/:rover", async (req, res) => {
  const { rover } = req.params;
  const { earth_date } = req.query;

  if (!VALID_ROVERS.includes(rover.toLowerCase())) {
    return res.status(400).json({ error: "Invalid rover name" });
  }

  if (!earth_date) {
    return res.status(400).json({ error: "Earth date is required" });
  }

  try {
    const response = await axios.get(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`,
      { 
        params: {
          api_key: NASA_API_KEY,
          earth_date
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ 
      error: "Failed to fetch Mars rover data",
      details: error.message 
    });
  }
});

module.exports = router;