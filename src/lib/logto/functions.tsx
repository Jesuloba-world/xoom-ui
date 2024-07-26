"use server";

import {
	signOut,
	signIn,
	getLogtoContext,
	getAccessToken,
} from "@logto/next/server-actions";
import { logtoConfig } from "./index";

export async function onSignIn() {
	await signIn(logtoConfig);
}

export async function onSignOut() {
	await signOut(logtoConfig);
}

export async function onGetAccessToken() {
	return await getAccessToken(logtoConfig, process.env.NEXT_PUBLIC_API_URL!);
}

export async function onGetLogtoContext(options?: { fetchUserInfo?: boolean }) {
	return await getLogtoContext(logtoConfig, {
		fetchUserInfo: options?.fetchUserInfo,
	});
}
