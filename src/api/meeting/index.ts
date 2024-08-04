import axios from "../index";
import { CreateInstantMeetingResponse, GetMeetingResponse } from "./types";

export const createInstantMeeting = ({}) => {
	return axios.post<CreateInstantMeetingResponse>("/meetings/instant");
};

export const getMeeting = ({ meeting_id }: { meeting_id: string }) => {
	return axios.get<GetMeetingResponse>(`/meetings/${meeting_id}`);
};
