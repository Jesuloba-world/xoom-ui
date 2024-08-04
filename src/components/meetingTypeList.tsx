"use client";

import { HomeCard } from "./homeCard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MeetingModal } from "./meetingModal";
import { useCreateInstantMeeting } from "@/api/meeting/hooks";
import { useToast } from "./ui/use-toast";

export const MeetingTypeList = () => {
	const [meetingState, setMeetingState] = useState<
		| "isScheduleMeeting"
		| "isJoiningMeeting"
		| "isInstantMeeting"
		| undefined
	>();

	const { toast } = useToast();
	const router = useRouter();
	const { mutate, isPending } = useCreateInstantMeeting();

	const createMeeting = () => {
		mutate(
			{},
			{
				onSuccess: (data) => {
					router.push(`/meeting/${data.data.meeting_id}`);
					toast({
						title: "Meeting created",
					});
				},
				onError: (err) => {
					toast({
						title: "Failed to create meeting",
						description: err.message,
						variant: "destructive",
					});
				},
			}
		);
	};

	const cards = [
		{
			img: "/icons/add-meeting.svg",
			title: "New Meeting",
			description: "Start an instant meeting",
			handleClick: () => setMeetingState("isInstantMeeting"),
			color: "orange",
		},
		{
			img: "/icons/schedule.svg",
			title: "Schedule Meeting",
			description: "Plan your meeting",
			handleClick: () => setMeetingState("isScheduleMeeting"),
			color: "blue",
		},
		{
			img: "/icons/recordings.svg",
			title: "View Recordings",
			description: "Check out your recordings",
			handleClick: () => router.push("/recordings"),
			color: "purple",
		},
		{
			img: "/icons/join-meeting.svg",
			title: "Join Meeting",
			description: "via invitation link",
			handleClick: () => setMeetingState("isJoiningMeeting"),
			color: "yellow",
		},
	];

	return (
		<section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 xl:w-fit">
			{cards.map(({ description, handleClick, img, title, color }, i) => (
				<HomeCard
					key={i}
					img={img}
					title={title}
					description={description}
					handleClick={handleClick}
					color={color}
				/>
			))}
			<MeetingModal
				isOpen={meetingState === "isInstantMeeting"}
				onClose={() => setMeetingState(undefined)}
				title={"Start an Instant Meeting"}
				className="text-center"
				buttonText={"Start Meeting"}
				handleClick={createMeeting}
				isPending={isPending}
			/>
		</section>
	);
};
