import { useEffect, useRef } from "react";
import { Switch } from "./ui/switch";

export interface meetingProps {
	stream: MediaStream | null;
	isAudioEnabled: boolean;
	isVideoEnabled: boolean;
	toggleVideo: () => void;
	toggleAudio: () => void;
}

export interface meetingSetupProps extends meetingProps {}

export const MeetingSetup = ({
	stream,
	isVideoEnabled,
	isAudioEnabled,
	toggleAudio,
	toggleVideo,
}: meetingSetupProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
			<h1 className="text-2xl font-bold">Setup</h1>
			<div>
				{isVideoEnabled && stream ? (
					<video
						ref={videoRef}
						autoPlay
						playsInline
						muted
						className="h-[420px] w-[740px] rounded-lg object-cover -scale-x-100"
					/>
				) : (
					<div className="h-[420px] w-[740px] rounded-lg bg-dark-1 flex items-center justify-center">
						<p>Camera is disabled</p>
					</div>
				)}
				{/* <audio ref={audioRef} autoPlay playsInline muted /> */}
			</div>
			<div className="flex gap-6">
				<div className="flex justify-center items-center gap-2">
					<span>Audio:</span>
					<Switch
						checked={isAudioEnabled}
						onCheckedChange={(bool: boolean) => toggleAudio()}
					/>
				</div>
				<div className="flex justify-center items-center gap-2">
					<span>Video:</span>
					<Switch
						checked={isVideoEnabled}
						onCheckedChange={(bool: boolean) => toggleVideo()}
					/>
				</div>
			</div>
		</div>
	);
};
