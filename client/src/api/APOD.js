import axios from 'axios';

const API_BASE_URL = "https://nasa-server-t7to.onrender.com/apod/";

export const fetchApod = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};


