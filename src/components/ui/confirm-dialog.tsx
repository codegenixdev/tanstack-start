import { createContext, type ReactNode, useContext, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmOptions = {
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "default" | "destructive";
};

type ConfirmContextType = (options?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState<ConfirmOptions>({});

	const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
		null,
	);

	const confirm = (opts?: ConfirmOptions) => {
		setOptions({
			title: "Are you sure?",
			description: "This action cannot be undone.",
			confirmText: "Continue",
			cancelText: "Cancel",
			variant: "default",
			...opts,
		});
		setOpen(true);

		return new Promise<boolean>((resolve) => {
			setResolver(() => resolve);
		});
	};

	const handleConfirm = () => {
		if (resolver) resolver(true);
		setOpen(false);
	};

	const handleCancel = () => {
		if (resolver) resolver(false);
		setOpen(false);
	};

	return (
		<ConfirmContext.Provider value={confirm}>
			{children}
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{options.title}</AlertDialogTitle>
						<AlertDialogDescription>
							{options.description}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCancel}>
							{options.cancelText}
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirm}
							className={
								options.variant === "destructive"
									? "bg-red-600 hover:bg-red-700"
									: ""
							}
						>
							{options.confirmText}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</ConfirmContext.Provider>
	);
}

export function useConfirm() {
	const context = useContext(ConfirmContext);
	if (!context) {
		throw new Error("useConfirm must be used within a ConfirmProvider");
	}
	return context;
}
