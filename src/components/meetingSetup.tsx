import { useEffect, useRef } from "react";
import { Switch } from "./ui/switch";
import { useMeeting } from "@/context/meetingContext";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export interface meetingSetupProps {
	joinMeeting: () => void;
}

export const MeetingSetup = ({ joinMeeting }: meetingSetupProps) => {
	const { isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo, stream } =
		useMeeting();

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
			<h1 className="text-2xl font-bold">Setup</h1>
			<div className="relative h-[420px] w-[740px] rounded-lg overflow-hidden">
				<video
					ref={(videoRef) => {
						if (videoRef) videoRef.srcObject = stream;
					}}
					autoPlay
					playsInline
					muted
					className={cn("h-full w-full object-cover -scale-x-100", {
						hidden: !isVideoEnabled,
					})}
				/>
				{!isVideoEnabled && (
					<div className="absolute inset-0 bg-dark-1 flex items-center justify-center">
						<p>Camera is disabled</p>
					</div>
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
				{/* Device settings */}
			</div>
			<Button
				className="rounded-md bg-green-500 px-4 py-2.5 hover:bg-green-500/60"
				onClick={() => {
					// trigger the join meeting call
					joinMeeting();
				}}
			>
				Join Meeting
			</Button>
		</div>
	);
};
