import axios from 'axios';
const API_BASE_URL = "http://localhost:9000/epic/";

export const fetchEpic = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};
