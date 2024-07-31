import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
	useUpdateEmail,
	useUpdateUsername,
	useVerifyAndSetEmail,
} from "@/api/user/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../ui/form";
import { Dialog, DialogContent } from "../ui/dialog";
import { useState } from "react";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	InputOTPSeparator,
} from "../ui/input-otp";
import { Loader2 } from "lucide-react";

const emailSchema = z.object({
	email: z.string(),
});

export const UpdateEmail = ({
	email,
	cancel,
}: {
	email?: string | null;
	cancel: () => void;
}) => {
	const [openOtpModal, setOpenOtpModal] = useState(false);

	const { mutate, isPending } = useUpdateEmail();

	const form = useForm<z.infer<typeof emailSchema>>({
		resolver: zodResolver(emailSchema),
		defaultValues: {
			email: email || "",
		},
	});

	function onSubmit(values: z.infer<typeof emailSchema>) {
		mutate(values.email, {
			onSuccess: () => {
				setOpenOtpModal(true);
			},
		});
	}

	return (
		<div className="flex flex-col gap-4">
			<p>Update username</p>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					<div className="flex gap-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Input
											className="bg-dark-2"
											// defaultValue={username || ""}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex gap-2 ml-auto">
						<Button
							type="button"
							onClick={cancel}
							variant={"outline"}
						>
							Cancel
						</Button>
						<Button isProcessing={isPending}>Save</Button>
					</div>
				</form>
			</Form>
			<EmailInputOtp
				open={openOtpModal}
				openChange={(open: boolean) => setOpenOtpModal(open)}
				email={form.getValues("email")}
				cancel={cancel}
			/>
		</div>
	);
};

const EmailInputOtp = ({
	open,
	openChange,
	email,
	cancel,
}: {
	open: boolean;
	openChange: (open: boolean) => void;
	email: string;
	cancel: () => void;
}) => {
	const MAX_LENGTH = 6;
	const [value, setValue] = useState("");
	const { mutate, isPending } = useVerifyAndSetEmail();
	if (value.length === MAX_LENGTH) {
		submotOtp();
	}

	function submotOtp() {
		const otp = value;
		setValue("");
		mutate(
			{ email, otp },
			{
				onSuccess: () => {
					openChange(false);
					cancel();
				},
				onError: () => {
					openChange(false);
				},
			}
		);
	}

	return (
		<Dialog open={open} onOpenChange={openChange} modal>
			<DialogContent className="bg-dark-1 text-white border-none">
				<div className="py-6 flex flex-col gap-4 items-center justify-center">
					<div className="flex items-center gap-4">
						<InputOTP
							maxLength={MAX_LENGTH}
							disabled={isPending}
							value={value}
							onChange={(value) => setValue(value)}
						>
							<InputOTPGroup>
								<InputOTPSlot index={0} />
							</InputOTPGroup>
							<InputOTPGroup>
								<InputOTPSlot index={1} />
							</InputOTPGroup>
							<InputOTPGroup>
								<InputOTPSlot index={2} />
							</InputOTPGroup>
							<InputOTPGroup>
								<InputOTPSlot index={3} />
							</InputOTPGroup>
							<InputOTPGroup>
								<InputOTPSlot index={4} />
							</InputOTPGroup>
							<InputOTPGroup>
								<InputOTPSlot index={5} />
							</InputOTPGroup>
						</InputOTP>
						{isPending && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
					</div>
					<div className="text-center text-sm">
						Your verification otp has been sent to your email.
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
