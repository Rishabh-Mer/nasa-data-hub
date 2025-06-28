import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/neo/`;

export const fetchNeoData = async (startDate, endDate) => {
  const response = await axios.get(API_BASE_URL, 
    { 
        params: 
        { 
            start_date: startDate,
            end_date: endDate
        } 
    });
  return response.data;
};