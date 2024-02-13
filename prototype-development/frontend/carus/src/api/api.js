/* eslint-disable consistent-return */
import axios from 'axios';

export const getEVChargers = async (latitude, longitude) => {
  try {
    if (lat && lng) {
      const { data } = await axios.get('https://ev-charge-finder.p.rapidapi.com/search-by-coordinates-point', {
        params: { lat: latitude, lng: longitude, limit: 20 },
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_EV_CHARGE_API_KEY,
          'X-RapidAPI-Host': 'ev-charge-finder.p.rapidapi.com'
        },
      });

      return data;
    }
  } catch (error) {
    console.log(error);
  }
};