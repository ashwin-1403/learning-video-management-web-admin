import { axiosInstance } from "../App";

export default async function PatchApi(endpoint, data, config) {
  try {
    const response = await axiosInstance.patch(endpoint, data, config);
    return response?.data;
  } catch (error) {
    console.error("Error in PatchApi:", error);
    throw error;
  }
}
