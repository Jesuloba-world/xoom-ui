"use client";

import { Button } from "../ui/button";
import { UserAvatar } from "./avatar";
import { useUpdateProfileImage } from "@/api/user/hooks";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { useRef, useState } from "react";

const profileImageSchema = z.object({
	file: z
		.instanceof(File)
		.refine(
			(file) => file.type.startsWith("image/"),
			"File must be an image"
		)
		.refine(
			(file) => file.size <= 5 * 1024 * 1024,
			"File size must be 5MB or less"
		)
		.nullable(),
});

export const UpdateProfile = ({
	profileImage,
	username,
	cancel,
}: {
	profileImage?: string | null;
	username?: string | null;
	cancel: () => void;
}) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		profileImage ?? null
	);

	const { mutate, isPending } = useUpdateProfileImage();

	const form = useForm<z.infer<typeof profileImageSchema>>({
		resolver: zodResolver(profileImageSchema),
		defaultValues: {
			file: null,
		},
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const selectedFile = event.target.files[0];
			form.setValue("file", selectedFile);

			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewUrl(reader.result as string);
			};
			reader.readAsDataURL(selectedFile);
		}
	};

	const removeFile = () => {
		setPreviewUrl(null);
		form.setValue("file", null);
	};

	function onSubmit(values: z.infer<typeof profileImageSchema>) {
		// mutate(values.file);

		const formData = new FormData();
		formData.append("image", values.file || "nil");

		mutate(formData, {
			onSettled() {
				cancel();
			},
		});
	}

	return (
		<div className="flex flex-col gap-4">
			<p>Update profile</p>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					<div className="flex gap-4">
						<UserAvatar
							profileImage={previewUrl}
							username={username}
						/>
						<div className="flex gap-2">
							<Button
								type={"button"}
								variant={"ghost"}
								onClick={() => {
									if (fileInputRef.current) {
										fileInputRef.current.click();
									}
								}}
							>
								Upload
							</Button>
							<input
								type="file"
								className="hidden"
								ref={fileInputRef}
								onChange={handleFileChange}
							/>
							<Button
								onClick={removeFile}
								type={"button"}
								variant={"destructive"}
							>
								Remove
							</Button>
						</div>
					</div>
					<div className="flex gap-2 ml-auto">
						<Button
							type={"button"}
							onClick={cancel}
							variant={"outline"}
						>
							Cancel
						</Button>
						<Button isProcessing={isPending}>Save</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};
