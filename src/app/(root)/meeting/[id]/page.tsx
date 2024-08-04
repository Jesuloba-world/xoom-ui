"use client";

import { useGetMeeting } from "@/api/meeting/hooks";
import Loader from "@/components/loader";
import { MeetingRoom } from "@/components/meetingRoom";
import { MeetingSetup } from "@/components/meetingSetup";
import { useToast } from "@/components/ui/use-toast";
import { useLogto } from "@/lib/logto/hooks";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Meeting({
	params: { id },
}: {
	params: { id: string };
}) {
	const { session } = useLogto();
	const { isLoading, error } = useGetMeeting(id);
	const { toast } = useToast();
	const router = useRouter();
	const [isSetupComplete, setIsSetupComplete] = useState(false);
	// const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
	// const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
	const [isVideoEnabled, setIsVideoEnabled] = useState(false);
	const [isAudioEnabled, setIsAudioEnabled] = useState(false);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [constraints, setConstraints] = useState<MediaStreamConstraints>({
		audio: false,
		video: false,
	});

	const initStream = useCallback(
		async (newConstraints: MediaStreamConstraints) => {
			try {
				const newStream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: true,
				});
				newStream
					.getTracks()
					.forEach((track) => (track.enabled = false));

				setStream(newStream);
			} catch (err) {
				console.error("Error accessing media devices:", err);
				toast({
					title: "Error accessing media devices",
					description: (err as Error).message,
					variant: "destructive",
				});
			}
		},
		[toast]
	);

	const toggleAudio = useCallback(() => {
		if (stream) {
			const audioTracks = stream.getAudioTracks();
			const newEnabledState = !isAudioEnabled;
			audioTracks.forEach((track) => (track.enabled = newEnabledState));
			setIsAudioEnabled(newEnabledState);
		}
	}, [stream, isAudioEnabled]);

	const toggleVideo = useCallback(() => {
		if (stream) {
			const videoTracks = stream.getVideoTracks();
			const newEnabledState = !isVideoEnabled;
			videoTracks.forEach((track) => (track.enabled = newEnabledState));
			setIsVideoEnabled(newEnabledState);
		}
	}, [stream, isVideoEnabled]);

	useEffect(() => {
		initStream(constraints);
		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	useEffect(() => {
		if (error) {
			router.push("/");
			toast({
				title: "Invalid meeting",
				description: "Meeting does not exist",
				variant: "destructive",
			});
		}
	}, [error, toast, router]);

	if (session.loading || isLoading) return <Loader />;

	return (
		<main className="h-screen w-full">
			{!isSetupComplete ? (
				<MeetingSetup
					stream={stream}
					// audioStream={audioStream}
					// videoStream={videoStream}
					isAudioEnabled={isAudioEnabled}
					isVideoEnabled={isVideoEnabled}
					toggleAudio={toggleAudio}
					toggleVideo={toggleVideo}
				/>
			) : (
				<MeetingRoom />
			)}
		</main>
	);
}
