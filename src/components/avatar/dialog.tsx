"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useLogto } from "@/lib/logto/hooks";
import { UserAvatar } from "./avatar";
import { Button } from "../ui/button";
import { UpdateProfile } from "./updateProfile";
import { UpdateUsername } from "./updateUsername";
import { UpdateEmail } from "./updateEmail";

export const UserManagementDialog = ({ children }: { children: ReactNode }) => {
	const { session } = useLogto();
	const username = session.userInfo?.username;
	const profileImage = session.userInfo?.picture;

	const [profileUpdate, setProfileUpdate] = useState(false);
	const [usernameUpdate, setUsernameUpdate] = useState(false);
	const [emailUpdate, setEmailUpdate] = useState(false);

	return (
		<Dialog>
			<DialogTrigger className="w-full">{children}</DialogTrigger>
			<DialogContent className="max-w-[800px] w-full bg-dark-1 text-white border-none">
				<div className="flex flex-col gap-8">
					<h4 className="text-2xl font-semibold">Profile details</h4>
					<div className="grid gap-y-6 grid-cols-2">
						<div>
							<p>Profile:</p>
						</div>
						{!profileUpdate ? (
							<div className="flex items-center justify-between">
								<UserAvatar
									profileImage={profileImage}
									username={username}
								/>
								<Button
									onClick={() => setProfileUpdate(true)}
									variant={"link"}
								>
									update profile
								</Button>
							</div>
						) : (
							<UpdateProfile
								profileImage={profileImage}
								username={username}
								cancel={() => setProfileUpdate(false)}
							/>
						)}
						<div>
							<p>Username:</p>
						</div>
						{!usernameUpdate ? (
							<div className="flex items-center justify-between">
								<p>{username}</p>
								<Button
									onClick={() => setUsernameUpdate(true)}
									variant={"link"}
								>
									update username
								</Button>
							</div>
						) : (
							<UpdateUsername
								username={username}
								cancel={() => setUsernameUpdate(false)}
							/>
						)}
						{/* <div>
							<p>Email address:</p>
						</div>
						{!emailUpdate ? (
							<div className="flex items-center justify-between">
								<p>{email}</p>
								<Button
									variant={"link"}
									onClick={() => setEmailUpdate(true)}
								>
									{email ? "update" : "add"} email
								</Button>
							</div>
						) : (
							<UpdateEmail
								cancel={() => setEmailUpdate(false)}
								email={email}
							/>
						)} */}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
