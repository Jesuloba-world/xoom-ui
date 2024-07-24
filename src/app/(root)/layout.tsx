import { ReactNode } from "react";
import { onGetLogtoContext } from "@/lib/logto/functions";
import { Protector } from "./protector";

export default async function RootLayout({
	children,
}: {
	children: ReactNode;
}) {
	const session = await onGetLogtoContext();
	return (
		<div>
			{session.isAuthenticated ? (
				children
			) : (
				<Protector isAuthenticated={session.isAuthenticated} />
			)}
		</div>
	);
}
