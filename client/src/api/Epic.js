import axios from 'axios';
const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/epic/`;

export const fetchEpic = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};
