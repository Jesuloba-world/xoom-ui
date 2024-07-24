"use client";

import { useLogto } from "@/lib/logto/hooks";

export const Protector = ({
	isAuthenticated,
}: {
	isAuthenticated: boolean;
}) => {
	const { signIn } = useLogto();
	if (!isAuthenticated) {
		signIn();
	}
	return (
		<div className="h-screen w-screen grid place-items-center">
			<h1 className="text-white text-4xl">You are not authenticated.</h1>
			<p className="text-white text-lg">redirecting...</p>
		</div>
	);
};
