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
	toggleVideo: () => void;
	toggleAudio: () => void;
	videoStream: MediaStream | null;
	audioStream: MediaStream | null;
	stream: MediaStream | null;
}

const MeetingContext = createContext<MeetingContextType>({
	isVideoEnabled: false,
	isAudioEnabled: false,
	toggleAudio: () => {},
	toggleVideo: () => {},
	audioStream: null,
	videoStream: null,
	stream: null,
});

export const MeetingContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const { toast } = useToast();

	const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
	const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [isVideoEnabled, setIsVideoEnabled] = useState(false);
	const [isAudioEnabled, setIsAudioEnabled] = useState(false);

	const getMedia = useCallback(
		async (constraints: MediaStreamConstraints) => {
			try {
				return await navigator.mediaDevices.getUserMedia(constraints);
			} catch (err) {
				console.error("Error accessing media devices:", err);
				toast({
					title: "Error accessing media devices",
					description: (err as Error).message,
					variant: "destructive",
				});
				return null;
			}
		},
		[toast]
	);

	const toggleAudio = useCallback(async () => {
		if (audioStream) {
			audioStream.getTracks().forEach((track) => track.stop());
			setAudioStream(null);
			setIsAudioEnabled(false);
		} else {
			const stream = await getMedia({ audio: true });
			if (stream) {
				setAudioStream(stream);
				setIsAudioEnabled(true);
			}
		}
	}, [audioStream, getMedia]);

	const toggleVideo = useCallback(async () => {
		if (videoStream) {
			videoStream.getTracks().forEach((track) => track.stop());
			setVideoStream(null);
			setIsVideoEnabled(false);
		} else {
			const stream = await getMedia({ video: true });
			if (stream) {
				setVideoStream(stream);
				setIsVideoEnabled(true);
			}
		}
	}, [videoStream, getMedia]);

	useEffect(() => {
		return () => {
			if (audioStream) {
				audioStream.getTracks().forEach((track) => track.stop());
			}
			if (videoStream) {
				videoStream.getTracks().forEach((track) => track.stop());
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const returnValues: MeetingContextType = {
		isVideoEnabled,
		isAudioEnabled,
		toggleAudio,
		toggleVideo,
		audioStream,
		videoStream,
		stream,
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
