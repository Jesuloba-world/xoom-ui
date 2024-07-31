import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	updateEmail,
	updateProfileImage,
	updateUsername,
	verifyAndSetEmail,
} from "./index";

export const useUpdateProfileImage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["update profile image"],
		mutationFn: (form: FormData) => updateProfileImage({ form }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["logtoContext"] });
		},
	});
};

export const useUpdateUsername = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["update username"],
		mutationFn: (username: string) => updateUsername(username),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["logtoContext"] });
		},
	});
};

export const useUpdateEmail = () => {
	return useMutation({
		mutationKey: ["update email"],
		mutationFn: (email: string) => updateEmail(email),
	});
};

export const useVerifyAndSetEmail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["update username"],
		mutationFn: (data: { email: string; otp: string }) =>
			verifyAndSetEmail(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["logtoContext"] });
		},
	});
};
