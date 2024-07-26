import { onGetAccessToken } from "@/lib/logto/functions";
import axios from "axios";

const customAxiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL!,
});

customAxiosInstance.interceptors.request.use(
	async (config) => {
		const accessToken = await onGetAccessToken();
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

export default customAxiosInstance;
