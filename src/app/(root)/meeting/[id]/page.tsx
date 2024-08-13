"use client";

import { useGetMeeting } from "@/api/meeting/hooks";
import Loader from "@/components/loader";
import { MeetingRoom } from "@/components/meetingRoom";
import { MeetingSetup } from "@/components/meetingSetup";
import { useToast } from "@/components/ui/use-toast";
import { MeetingContextProvider } from "@/context/meetingContext";
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
			<MeetingContextProvider>
				{!isSetupComplete ? (
					<MeetingSetup
						joinMeeting={() => setIsSetupComplete(true)}
					/>
				) : (
					<MeetingRoom meetingId={id} />
				)}
			</MeetingContextProvider>
		</main>
	);
}
