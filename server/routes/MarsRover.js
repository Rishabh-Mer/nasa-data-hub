const express = require("express");
const axios = require("axios");
const router = express.Router();

const NASA_API_KEY = process.env.NASA_API_KEY;

router.get("/:rover", async (req, res) => {
  const { rover } = req.params;
  const { earth_date, sol } = req.query;

  const params = {
    api_key: NASA_API_KEY,
  };

  if (earth_date) {
    params.earth_date = earth_date;
  } else if (sol) {
    params.sol = sol;
  } else {
    return res.status(400).json({ error: "Earth date or sol required" });
  }

  try {
    const response = await axios.get(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`,
      { params }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch Mars rover data" });
  }
});

module.exports = router;