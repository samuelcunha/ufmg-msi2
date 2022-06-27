import axios from "axios";

const axiosConfig = {
    location: process.env.REACT_APP_API_COVERIT
};
export default axios.create({
    baseURL: axiosConfig.location,
});