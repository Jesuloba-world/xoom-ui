"use client";

import { useToast } from "@/components/ui/use-toast";
import {
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface MeetingContextType {
	isVideoEnabled: boolean;
	isAudioEnabled: boolean;
	stream: MediaStream | null;
	toggleVideo: () => void;
	toggleAudio: () => void;
}

const MeetingContext = createContext<MeetingContextType>({
	isVideoEnabled: false,
	isAudioEnabled: false,
	stream: null,
	toggleAudio: () => {},
	toggleVideo: () => {},
});

export const MeetingContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const { toast } = useToast();

	// const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
	// const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
	const [isVideoEnabled, setIsVideoEnabled] = useState(false);
	const [isAudioEnabled, setIsAudioEnabled] = useState(false);
	const [stream, setStream] = useState<MediaStream | null>(null);
	// const [constraints, setConstraints] = useState<MediaStreamConstraints>({
	// 	audio: false,
	// 	video: false,
	// });

	const initializeStream = useCallback(async () => {
		try {
			const newStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true,
			});
			setStream(newStream);
		} catch (err) {
			console.error("Error accessing media devices:", err);
			toast({
				title: "Error accessing media devices",
				description: (err as Error).message,
				variant: "destructive",
			});
		}
	}, [toast]);

	const toggleAudio = useCallback(() => {
		if (stream) {
			const audioTrack = stream.getAudioTracks()[0];
			audioTrack.enabled = !audioTrack.enabled;
			setIsAudioEnabled(audioTrack.enabled);
		}
	}, [stream]);

	const toggleVideo = useCallback(() => {
		if (stream) {
			const videoTrack = stream.getVideoTracks()[0];
			videoTrack.enabled = !videoTrack.enabled;
			setIsVideoEnabled(videoTrack.enabled);
		}
	}, [stream]);

	useEffect(() => {
		initializeStream();
		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initializeStream]);

	const returnValues: MeetingContextType = {
		isVideoEnabled,
		isAudioEnabled,
		stream,
		toggleAudio,
		toggleVideo,
	};

	return (
		<MeetingContext.Provider value={returnValues}>
			{children}
		</MeetingContext.Provider>
	);
};

export const useMeeting = () => {
	const context = useContext(MeetingContext);
	if (!context) {
		throw new Error(
			"useMeeting must be used within a MeetingContextProvider"
		);
	}

	return context;
};
