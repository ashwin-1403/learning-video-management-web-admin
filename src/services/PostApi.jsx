import { axiosInstance } from "../App";

export default async function PostApi(endpoint, data) {
  const response = await axiosInstance.post(endpoint, data);
  return response;
}
