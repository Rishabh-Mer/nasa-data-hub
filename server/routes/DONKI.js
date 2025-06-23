require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 9000;
const router = express.Router();

app.use(cors());
app.use(express.json());

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

// Helper function to fetch NASA DONKI data
const fetchDonkiData = async (endpoint, params) => {
  try {
    const response = await axios.get(`https://api.nasa.gov/DONKI/${endpoint}`, {
      params: {
        api_key: NASA_API_KEY,
        ...params
      }
    });
    console.log("->>>",fetchDonkiData);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint} data:`, error.message);
    return null;
  }
};

// API Endpoints
router.get('/donki/cme', async (req, res) => {
  const { startDate, endDate } = req.query;
  const data = await fetchDonkiData('CME', { startDate, endDate });
  res.json(data || []);
});

router.get('/donki/flr', async (req, res) => {
  const { startDate, endDate } = req.query;
  const data = await fetchDonkiData('FLR', { startDate, endDate });
  res.json(data || []);
});

router.get('/donki/sep', async (req, res) => {
  const { startDate, endDate } = req.query;
  const data = await fetchDonkiData('SEP', { startDate, endDate });
  res.json(data || []);
});

router.get('/donki/gst', async (req, res) => {
  const { startDate, endDate } = req.query;
  const data = await fetchDonkiData('GST', { startDate, endDate });
  res.json(data || []);
});

router.get('/donki/status', async (req, res) => {
  // Get current date and previous month for status data
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);
  
  const cmeData = await fetchDonkiData('CME', { 
    startDate: startDate.toISOString().split('T')[0], 
    endDate 
  });
  
  const flrData = await fetchDonkiData('FLR', { 
    startDate: startDate.toISOString().split('T')[0], 
    endDate 
  });
  
  res.json({
    cmeCount: cmeData ? cmeData.length : 0,
    flareCount: flrData ? flrData.length : 0,
    lastUpdated: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = router;