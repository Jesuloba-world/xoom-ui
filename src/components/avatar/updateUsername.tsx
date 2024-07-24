import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const UpdateUsername = ({
	username,
	cancel,
}: {
	username?: string | null;
	cancel: () => void;
}) => {
	return (
		<div className="flex flex-col gap-4">
			<p>Update username</p>
			<div className="flex gap-4">
				<Input className="bg-dark-2" defaultValue={username || ""} />
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
