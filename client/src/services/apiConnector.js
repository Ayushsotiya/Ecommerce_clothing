import axios from "axios";

const axiosInstance = axios.create();

export const apiConnector = (method, url, bodyData , headers , params ) => {
  return axiosInstance({
    method,
    url,
    data: bodyData,
    headers,
    params,
  });
};
