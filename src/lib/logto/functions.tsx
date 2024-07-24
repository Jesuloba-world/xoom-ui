"use server";

import { signOut, signIn } from "@logto/next/server-actions";
import { logtoConfig } from "./index";
import { getLogtoContext } from "@logto/next/server-actions";

export async function onSignIn() {
	await signIn(logtoConfig);
}

export async function onSignOut() {
	await signOut(logtoConfig);
}

export async function onGetLogtoContext(options?: { fetchUserInfo?: boolean }) {
	return await getLogtoContext(logtoConfig, {
		fetchUserInfo: options?.fetchUserInfo,
	});
}
