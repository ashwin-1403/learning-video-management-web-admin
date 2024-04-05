import { axiosInstance } from "../App";

export default async function GetApi(endpoint, params) {
  const token = localStorage?.getItem("token");
  const config = {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axiosInstance.get(endpoint, config);
  return response?.data;
}
