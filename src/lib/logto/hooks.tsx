"use client";

import { useQuery } from "@tanstack/react-query";
import { onGetLogtoContext, onSignIn, onSignOut } from "./functions";
import { IdTokenClaims, UserInfoResponse } from "@logto/next";

type useLogtoType = () => {
	signIn: () => Promise<void>;
	signOut: () => Promise<void>;
	session: {
		isAuthenticated: boolean;
		loading: boolean;
		claims?: IdTokenClaims;
		userInfo?: UserInfoResponse;
	};
};

export const useLogto: useLogtoType = () => {
	const signIn = async () => {
		await onSignIn();
	};

	const signOut = async () => {
		await onSignOut();
	};

	const { data, isPending } = useGetLogtoContext();

	return {
		signIn,
		signOut,
		session: {
			loading: isPending,
			isAuthenticated: data?.isAuthenticated ?? false,
			claims: data?.claims,
			userInfo: data?.userInfo,
		},
	};
};

const useGetLogtoContext = () =>
	useQuery({
		queryKey: ["logtoContext"],
		queryFn: async () => await onGetLogtoContext({ fetchUserInfo: true }),
	});
