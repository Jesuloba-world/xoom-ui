import { useEffect, useRef } from "react";
import { Switch } from "./ui/switch";
import { useMeeting } from "@/context/meetingContext";

export interface meetingProps {}

export interface meetingSetupProps extends meetingProps {}

export const MeetingSetup = ({}: meetingSetupProps) => {
	const {
		isAudioEnabled,
		isVideoEnabled,
		toggleAudio,
		toggleVideo,
		audioStream,
		videoStream,
	} = useMeeting();

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
			<h1 className="text-2xl font-bold">Setup</h1>
			<div>
				{isVideoEnabled && videoStream ? (
					<video
						ref={(videoElement) => {
							if (videoElement)
								videoElement.srcObject = videoStream;
						}}
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
				{isAudioEnabled && audioStream && (
					<audio
						ref={(audioElement) => {
							if (audioElement)
								audioElement.srcObject = audioStream;
						}}
						autoPlay
						playsInline
						muted
					/>
				)}
			</div>
			<div className="flex h-16 items-center justify-center gap-6">
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
