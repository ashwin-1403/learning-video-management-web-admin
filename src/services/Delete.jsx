import { axiosInstance } from "../App";
export default async function DeleteApi(endpoint) {
  try {
    const response = await axiosInstance.delete(endpoint);
    return response;
  } catch (error) {
    console.error("Error in DELETE request:", error);
    throw error;
  }
}
