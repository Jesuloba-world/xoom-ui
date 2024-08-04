import { Loader2 } from "lucide-react";

const Loader = () => {
	return (
		<div className="flex-center h-screen w-full">
			<Loader2 className="h-14 w-14 animate-spin text-white" />
		</div>
	);
};

export default Loader;
