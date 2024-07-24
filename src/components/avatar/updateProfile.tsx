import { Button } from "../ui/button";
import { UserAvatar } from "./avatar";

export const UpdateProfile = ({
	username,
	cancel,
}: {
	username?: string | null;
	cancel: () => void;
}) => {
	return (
		<div className="flex flex-col gap-4">
			<p>Update profile</p>
			<div className="flex gap-4">
				<UserAvatar username={username} />
				<div className="flex gap-2">
					<Button variant={"ghost"}>Upload</Button>
					<Button variant={"destructive"}>Remove</Button>
				</div>
			</div>
			<div className="flex gap-2 ml-auto">
				<Button onClick={cancel} variant={"outline"}>
					Cancel
				</Button>
				<Button>Save</Button>
			</div>
		</div>
	);
};
