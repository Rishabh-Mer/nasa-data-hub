import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/apod/`;

export const fetchApod = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};


