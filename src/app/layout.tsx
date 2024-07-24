import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextQueryProvider } from "./queryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Xoom",
	description: "A zoom clone by @jesuloba0_",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<NextQueryProvider>
				<body className={`${inter.className} bg-dark-2`}>
					{children}
				</body>
			</NextQueryProvider>
		</html>
	);
}
