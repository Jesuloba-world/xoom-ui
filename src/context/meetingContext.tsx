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
	stream: MediaStream | null;
}

interface Device {
	id: string;
	label: string;
}

const MeetingContext = createContext<MeetingContextType>({
	isVideoEnabled: false,
	isAudioEnabled: false,
	toggleAudio: () => {},
	toggleVideo: () => {},
	stream: null,
});

export const MeetingContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const { toast } = useToast();

	const [stream, setStream] = useState<MediaStream | null>(null);
	const [isVideoEnabled, setIsVideoEnabled] = useState(false);
	const [isAudioEnabled, setIsAudioEnabled] = useState(false);
	// const [audioInputDevices, setAudioInputDevices] = useState<Device[]>();
	// const [videoInputDevices, setVideoInputDevices] = useState<Device[]>();

	// TODO: work on device selection later

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
		if (isAudioEnabled) {
			if (stream) {
				const audioTracks = stream.getAudioTracks();
				audioTracks.forEach((track) => {
					track.stop();
					stream.removeTrack(track);
				});
			}
			setIsAudioEnabled(false);
		} else {
			const audioStream = await getMedia({ audio: true });
			if (audioStream) {
				if (stream) {
					audioStream
						.getAudioTracks()
						.forEach((track) => stream.addTrack(track));
				} else {
					setStream(audioStream);
				}
				setIsAudioEnabled(true);
			}
		}
	}, [getMedia, isAudioEnabled, stream]);

	const toggleVideo = useCallback(async () => {
		if (isVideoEnabled) {
			if (stream) {
				const videoTracks = stream.getVideoTracks();
				videoTracks.forEach((track) => {
					track.stop();
					stream.removeTrack(track);
				});
			}
			setIsVideoEnabled(false);
		} else {
			const videoStream = await getMedia({ video: true });
			if (videoStream) {
				if (stream) {
					videoStream
						.getVideoTracks()
						.forEach((track) => stream.addTrack(track));
				} else {
					setStream(videoStream);
				}
				setIsVideoEnabled(true);
			}
		}
	}, [isVideoEnabled, stream, getMedia]);

	// const updateDeviceList = useCallback(async () => {
	// 	const devices = await navigator.mediaDevices.enumerateDevices();

	// 	const audioDevices = devices
	// 		.filter((device) => device.kind === "audioinput")
	// 		.map((device) => ({ id: device.deviceId, label: device.label }));
	// 	const videoDevices = devices
	// 		.filter((device) => device.kind === "videoinput")
	// 		.map((device) => ({ id: device.deviceId, label: device.label }));

	// 	setAudioInputDevices(audioDevices);
	// 	setVideoInputDevices(videoDevices);
	// }, []);

	useEffect(() => {
		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// useEffect(() => {
	// 	// set and update device list
	// 	updateDeviceList();
	// 	navigator.mediaDevices.addEventListener(
	// 		"devicechange",
	// 		updateDeviceList
	// 	);
	// 	return () => {
	// 		navigator.mediaDevices.removeEventListener(
	// 			"devicechange",
	// 			updateDeviceList
	// 		);
	// 	};
	// }, [updateDeviceList]);

	const returnValues: MeetingContextType = {
		isVideoEnabled,
		isAudioEnabled,
		toggleAudio,
		toggleVideo,
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
