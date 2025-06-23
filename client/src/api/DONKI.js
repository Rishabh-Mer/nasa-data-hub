import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:9000/';

export const fetchCME = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE}/donki/cme`, {
      params: { startDate, endDate }
    });
    return response.data;
    console.log("CME: ", response.data);
  } catch (error) {
    console.error("Error fetching CME data:", error);
    return [];
  }
};

export const fetchFLR = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE}/donki/flr`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching FLR data:", error);
    return [];
  }
};

export const fetchSEP = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE}/donki/sep`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching SEP data:", error);
    return [];
  }
};

export const fetchGST = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE}/donki/gst`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching GST data:", error);
    return [];
  }
};

export const fetchStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE}/donki/status`);
    return response.data;
  } catch (error) {
    console.error("Error fetching status data:", error);
    return { cmeCount: 0, flareCount: 0, lastUpdated: new Date().toISOString() };
  }
};