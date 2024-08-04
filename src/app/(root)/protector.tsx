"use client";

import Loader from "@/components/loader";
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
	return <Loader />;
};
