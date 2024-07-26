"use client";

import { PopoverMenu } from "./popoverMenu";
import { UserAvatar } from "./avatar";
import { useLogto } from "@/lib/logto/hooks";

export const User = () => {
	const { session } = useLogto();
	const username = session.userInfo?.username;
	const profileImage = session.userInfo?.picture;

	return (
		<PopoverMenu>
			<UserAvatar
				variant={"small"}
				profileImage={profileImage}
				username={username}
			/>
		</PopoverMenu>
	);
};
