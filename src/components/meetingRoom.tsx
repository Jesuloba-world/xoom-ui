"use client";

import { useMeeting } from "@/context/meetingContext";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetAccessToken } from "@/lib/logto/hooks";
import Peer from "simple-peer";

interface PeerData {
	[key: string]: MediaStream;
}

interface webSocketMessage {
	type: "offer" | "answer" | "ice-candidate" | "new-peer";
	peerId?: string;
	signal?: Peer.SignalData;
	from?: string;
	to?: string;
}

export const MeetingRoom = ({ meetingId }: { meetingId: string }) => {
	const [socketUrl, setSocketUrl] = useState<string | null>(null);
	const { isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo, stream } =
		useMeeting();

	const [peers, setPeers] = useState<PeerData>({});
	const peerRefs = useRef<{ [key: string]: Peer.Instance }>({});

	const { data: token, isLoading } = useGetAccessToken();

	useEffect(() => {
		if (isLoading || !token) return;
		const setupWebSocket = async () => {
			setSocketUrl(
				`${process.env
					.NEXT_PUBLIC_WS_URL!}/room/${meetingId}?token=${token}`
			);
		};
		setupWebSocket();
	}, [meetingId, token, isLoading]);

	const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
		shouldReconnect: () => true,
		reconnectAttempts: 5,
	});

	const connectionStatus = {
		[ReadyState.CONNECTING]: "Connecting",
		[ReadyState.OPEN]: "Open",
		[ReadyState.CLOSING]: "Closing",
		[ReadyState.CLOSED]: "Closed",
		[ReadyState.UNINSTANTIATED]: "Uninstantiated",
	}[readyState];

	console.log("connection", connectionStatus);

	useEffect(() => {
		if (lastMessage !== null) {
			const data: webSocketMessage = JSON.parse(lastMessage.data);
			switch (data.type) {
				case "new-peer":
					if (data.peerId) createPeer(data.peerId, true);
					break;
				case "offer":
					handleOffer(data);
					break;
				case "answer":
					handleAnswer(data);
					break;
				case "ice-candidate":
					handleICECandidate(data);
					break;
				default:
					console.log("invalid data type", data.type);
			}
		}
	}, [lastMessage]);

	const createPeer = useCallback(
		(peerId: string, initiator: boolean) => {
			if (!stream) return;

			const peer = new Peer({
				initiator,
				stream,
				trickle: true,
			});

			peer.on("signal", (peerStream: Peer.SignalData) => {
				sendMessage(
					JSON.stringify({
						type: initiator ? "offer" : "answer",
						to: peerId,
						signal: peerStream,
					})
				);
			});

			peer.on("stream", (peerStream: MediaStream) => {
				setPeers((prevPeers) => ({
					...prevPeers,
					[peerId]: peerStream,
				}));
			});

			peerRefs.current[peerId] = peer;
			return peer;
		},
		[stream, sendMessage]
	);

	const handleOffer = (data: webSocketMessage) => {
		if (data.from && data.signal) {
			createPeer(data.from, false);
			peerRefs.current[data.from].signal(data.signal);
		}
	};

	const handleAnswer = (data: webSocketMessage) => {
		if (data.from && data.signal) {
			peerRefs.current[data.from].signal(data.signal);
		}
	};

	const handleICECandidate = (data: webSocketMessage) => {
		if (data.from && data.signal) {
			peerRefs.current[data.from].signal(data.signal);
		}
	};

	return (
		<section className="relative h-screen w-full overflow-hidden pt-4 text-white">
			<div className="relative flex size-full items-center justify-center">
				<div className="flex flex-col size-full max-h-screen gap-4 max-w-[1000px] items-center">
					<h2>Meeting room</h2>
					<div className="flex flex-wrap size-full">
						<div className="relative h-full w-full rounded-lg overflow-hidden">
							<video
								ref={(videoRef) => {
									if (videoRef) videoRef.srcObject = stream;
								}}
								autoPlay
								playsInline
								muted
								className={cn(
									"h-full w-full object-cover -scale-x-100",
									{
										hidden: !isVideoEnabled,
									}
								)}
							/>
							{!isVideoEnabled && (
								<div className="absolute inset-0 bg-dark-1 flex items-center justify-center">
									<p>Camera is disabled</p>
								</div>
							)}
						</div>
						{Object.entries(peers).map(([peerId, peerStream]) => (
							<video
								key={peerId}
								autoPlay
								ref={(el) => {
									if (el) el.srcObject = peerStream;
								}}
							/>
						))}
					</div>
					<div className="flex h-16 items-center justify-center gap-6">
						<div className="flex justify-center items-center gap-2">
							<span>Audio:</span>
							<Switch
								checked={isAudioEnabled}
								onCheckedChange={(bool: boolean) =>
									toggleAudio()
								}
							/>
						</div>
						<div className="flex justify-center items-center gap-2">
							<span>Video:</span>
							<Switch
								checked={isVideoEnabled}
								onCheckedChange={(bool: boolean) =>
									toggleVideo()
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
