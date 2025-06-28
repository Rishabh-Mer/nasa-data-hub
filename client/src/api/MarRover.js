import axios from 'axios';

const API_BASE_URL = "http://localhost:9000/mars";

export const fetchMarsRover = async (rover, earthDate) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${rover}`, {
            params: { earth_date: earthDate }
        });
        return response.data;
    } catch (error) {
        console.error('Mars Rover API Error:', error);
        throw error;
    }
};
