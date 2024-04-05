import { axiosInstance } from "../App";

export default async function PutApi(endpoint, data, config) {
  const response = await axiosInstance.put(endpoint, data, config);
  return response;
}
