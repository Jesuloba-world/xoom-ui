import { useMutation, useQuery } from "@tanstack/react-query";
import { createInstantMeeting, getMeeting } from "./index";

export const useCreateInstantMeeting = () => {
	return useMutation({
		mutationKey: ["create instant meeting"],
		mutationFn: createInstantMeeting,
	});
};

export const useGetMeeting = (id: string) => {
	return useQuery({
		queryKey: ["meeting", id],
		queryFn: () => getMeeting({ meeting_id: id }),
		retry: false,
	});
};
