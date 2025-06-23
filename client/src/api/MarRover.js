import axios from 'axios';

const API_BASE_URL = "http://localhost:9000/mars/";

export const fetchMarsRover = async (rover, sol=1000, page=1) => {
    const response = await axios.get(`${API_BASE_URL}/${rover}`, {
        params: { sol, page }
    });
    return response.data;
};


