import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileImage } from "./index";

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
