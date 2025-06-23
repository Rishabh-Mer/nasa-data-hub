const express = require("express");
const axios = require("axios");
const router = express.Router();
const API_KEY = process.env.NASA_API_KEY;

router.get("/", async (req, res) => {
  const { start_date, end_date } = req.query;
  if (!start_date || !end_date) return res.status(400).json({ error: "start_date  and end_date required" });

  try {
    const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/feed`, {
      params: {
          start_date,
          end_date,
          api_key: API_KEY,
      },
    });
    res.json(response.data);
    console.log("Response from Express Neo ", response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch NEO data" });
  }
});

module.exports = router;