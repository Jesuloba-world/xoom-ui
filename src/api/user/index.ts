import axios from "../index";

export const updateProfileImage = ({ form }: { form: FormData }) => {
	return axios.post("/user/profileimage", form);
};
