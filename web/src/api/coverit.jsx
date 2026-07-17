import axios from "axios";

const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

export default axios.create({
  baseURL: publicApiUrl,
});

export function getServerClient() {
  const internalApiUrl = process.env.API_INTERNAL_URL || publicApiUrl;
  return axios.create({
    baseURL: internalApiUrl,
  });
}
