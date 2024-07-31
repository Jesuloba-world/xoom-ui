import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useUpdateUsername } from "@/api/user/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";

const usernameSchema = z.object({
	username: z.string(),
});

export const UpdateUsername = ({
	username,
	cancel,
}: {
	username?: string | null;
	cancel: () => void;
}) => {
	const { mutate, isPending } = useUpdateUsername();

	const form = useForm<z.infer<typeof usernameSchema>>({
		resolver: zodResolver(usernameSchema),
		defaultValues: {
			username: username || "",
		},
	});

	function onSubmit(values: z.infer<typeof usernameSchema>) {
		mutate(values.username, {
			onSettled() {
				cancel();
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
							name="username"
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
		</div>
	);
};
