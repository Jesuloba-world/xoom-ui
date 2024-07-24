"use client";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode } from "react";
import { UserAvatar } from "./avatar";
import { useLogto } from "@/lib/logto/hooks";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, Settings } from "lucide-react";
import { UserManagementDialog } from "./dialog";

export const PopoverMenu = ({ children }: { children: ReactNode }) => {
	const { session, signOut } = useLogto();
	const username = session.userInfo?.username;
	return (
		<Popover>
			<PopoverTrigger>{children}</PopoverTrigger>
			<PopoverContent
				align="end"
				sideOffset={12}
				className="bg-dark-1 text-white border-none p-0 py-5"
			>
				<div className="flex flex-col gap-4">
					<div className="flex px-5 gap-4">
						<UserAvatar username={username} />
						<div className="flex flex-col gap-1">
							<h6>{username}</h6>
						</div>
					</div>
					<div>
						<UserManagementDialog>
							<Button
								className="w-full flex items-center justify-start px-5 rounded-none bg-dark-1 hover:bg-dark-2 gap-4"
								size={"lg"}
							>
								<Settings /> Manage Account
							</Button>
						</UserManagementDialog>
						<Separator className="bg-white/30 w-11/12 mx-auto" />
						<Button
							className="w-full flex items-center justify-start px-5 rounded-none bg-dark-1 hover:bg-dark-2 gap-4"
							size={"lg"}
							onClick={signOut}
						>
							<LogOut /> Sign Out
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
