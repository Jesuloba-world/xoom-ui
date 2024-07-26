import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const UserAvatar = ({
	profileImage,
	username,
	variant = "normal",
}: {
	profileImage?: string | null;
	username?: string | null;
	variant?: "normal" | "small";
}) => {
	return (
		<Avatar className={cn("", { "size-8": variant === "small" })}>
			<AvatarImage src={profileImage!} />
			<AvatarFallback className="text-dark-1">
				{username?.charAt(0).toUpperCase()}
			</AvatarFallback>
		</Avatar>
	);
};
