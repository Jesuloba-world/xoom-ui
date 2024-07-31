import axios from "../index";

export const updateProfileImage = ({ form }: { form: FormData }) => {
	return axios.patch("/user/profileimage", form);
};

export const updateUsername = (username: string) => {
	return axios.patch("/user/username", { username });
};

export const updateEmail = (email: string) => {
	return axios.patch("/user/email", { email });
};

export const verifyAndSetEmail = (data: { email: string; otp: string }) => {
	return axios.post("/user/email", data);
};
