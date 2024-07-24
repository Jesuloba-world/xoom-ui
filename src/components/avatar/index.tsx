import { PopoverMenu } from "./popoverMenu";
import { UserAvatar } from "./avatar";
import { useLogto } from "@/lib/logto/hooks";
import { onGetLogtoContext } from "@/lib/logto/functions";

export const User = async () => {
	const session = await onGetLogtoContext();
	const username = session.claims?.username;

	return (
		<PopoverMenu>
			<UserAvatar variant={"small"} username={username} />
		</PopoverMenu>
	);
};
