import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormValues = {
	x: string;
	y: string;
};

export const CoordinateForm = ({
	onAdd,
	values,
	stageSize,
}: {
	onAdd: (x: number, y: number) => void;
	values?: { x: number; y: number };
	stageSize: { w: number; h: number };
}) => {
	const [errors, setErrors] = useState<{ x?: string; y?: string }>({});
	const [isUserEditing, setIsUserEditing] = useState(false);

	const { register, handleSubmit, setValue } = useForm<FormValues>({
		defaultValues: { x: "40", y: "40" },
	});

	const clearError = (field: "x" | "y") => {
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
		setIsUserEditing(true);
	};

	const submit = () => {
		setErrors({});

		const xInput = document.querySelector(
			'input[name="x"]',
		) as HTMLInputElement;
		const yInput = document.querySelector(
			'input[name="y"]',
		) as HTMLInputElement;
		const rawX = xInput?.value || "";
		const rawY = yInput?.value || "";

		if (!rawX.trim() || !rawY.trim()) {
			const errorMessage = "Please enter both X and Y coordinates";
			toast.error(errorMessage, {
				style: {
					background: "#fef2f2",
					border: "1px solid #fecaca",
					color: "#dc2626",
				},
			});
			setErrors({
				x: !rawX.trim() ? errorMessage : undefined,
				y: !rawY.trim() ? errorMessage : undefined,
			});

			if (!rawX.trim()) {
				xInput?.focus();
				setTimeout(() => xInput?.select(), 0);
			}
			if (!rawY.trim()) {
				yInput?.focus();
				setTimeout(() => yInput?.select(), 0);
			}
			return;
		}

		const numericRegex = /^-?\d+$/;

		if (!numericRegex.test(rawX) || !numericRegex.test(rawY)) {
			const errorMessage = "Please enter valid numbers only";
			toast.error(errorMessage, {
				style: {
					background: "#fef2f2",
					border: "1px solid #fecaca",
					color: "#dc2626",
				},
			});
			setErrors({
				x: !numericRegex.test(rawX) ? errorMessage : undefined,
				y: !numericRegex.test(rawY) ? errorMessage : undefined,
			});

			if (!numericRegex.test(rawX)) {
				xInput?.focus();
				setTimeout(() => xInput?.select(), 0);
			}
			if (!numericRegex.test(rawY)) {
				yInput?.focus();
				setTimeout(() => yInput?.select(), 0);
			}
			return;
		}

		const x = Number(rawX);
		const y = Number(rawY);

		if (Number.isNaN(x) || Number.isNaN(y)) {
			const errorMessage = "Please enter valid numbers";
			toast.error(errorMessage, {
				style: {
					background: "#fef2f2",
					border: "1px solid #fecaca",
					color: "#dc2626",
				},
			});
			setErrors({
				x: Number.isNaN(x) ? errorMessage : undefined,
				y: Number.isNaN(y) ? errorMessage : undefined,
			});

			if (Number.isNaN(x)) {
				xInput?.focus();
				setTimeout(() => xInput?.select(), 0);
			}
			if (Number.isNaN(y)) {
				yInput?.focus();
				setTimeout(() => yInput?.select(), 0);
			}
			return;
		}

		if (x < 0 || y < 0) {
			const errorMessage = "Coordinates must be 0 or greater";
			toast.error(errorMessage, {
				style: {
					background: "#fef2f2",
					border: "1px solid #fecaca",
					color: "#dc2626",
				},
			});
			setErrors({
				x: x < 0 ? errorMessage : undefined,
				y: y < 0 ? errorMessage : undefined,
			});

			if (x < 0) {
				xInput?.focus();
				setTimeout(() => xInput?.select(), 0);
			}
			if (y < 0) {
				yInput?.focus();
				setTimeout(() => yInput?.select(), 0);
			}
			return;
		}

		// Subtracting here because of circle radius
		const maxX = stageSize.w - 16;
		const maxY = stageSize.h - 16;

		if (x > maxX || y > maxY) {
			const errorMessage = `Coordinates must be within image bounds (max X: ${Math.round(maxX)}, max Y: ${Math.round(maxY)})`;
			toast.error(errorMessage, {
				style: {
					background: "#fef2f2",
					border: "1px solid #fecaca",
					color: "#dc2626",
				},
			});
			setErrors({
				x: x > maxX ? errorMessage : undefined,
				y: y > maxY ? errorMessage : undefined,
			});

			if (x > maxX) {
				xInput?.focus();
				setTimeout(() => xInput?.select(), 0);
			}
			if (y > maxY) {
				yInput?.focus();
				setTimeout(() => yInput?.select(), 0);
			}
			return;
		}

		onAdd(x, y);
		setIsUserEditing(false);
	};

	if (values && !isUserEditing) {
		const roundedX = Math.round(values.x);
		const roundedY = Math.round(values.y);
		setValue("x", roundedX.toString());
		setValue("y", roundedY.toString());
	}

	return (
		<form onSubmit={handleSubmit(submit)} className="space-y-7">
			<div>
				<h2 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
					Distance
				</h2>
				<p className="text-neutral-600">
					Set coordinates for the circle position
				</p>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<label className="flex flex-col gap-3">
					<span className="text-sm font-medium text-neutral-700 pl-2">
						X coordinate
					</span>
					<input
						{...register("x")}
						type="text"
						inputMode="numeric"
						onChange={(e) => {
							clearError("x");
							register("x").onChange(e);
						}}
						className={`rounded-2xl border bg-white px-5 py-4 text-lg outline-none ring-0 transition-all focus:shadow-lg ${
							errors.x
								? "border-red-500 focus:border-red-500"
								: "border-neutral-200 focus:border-blue-500"
						}`}
						placeholder="0"
					/>
				</label>
				<label className="flex flex-col gap-3">
					<span className="text-sm font-medium text-neutral-700 pl-2">
						Y coordinate
					</span>
					<input
						{...register("y")}
						type="text"
						inputMode="numeric"
						onChange={(e) => {
							clearError("y");
							register("y").onChange(e);
						}}
						className={`rounded-2xl border bg-white px-5 py-4 text-lg outline-none ring-0 transition-all focus:shadow-lg ${
							errors.y
								? "border-red-500 focus:border-red-500"
								: "border-neutral-200 focus:border-blue-500"
						}`}
						placeholder="0"
					/>
				</label>
			</div>
			<button
				type="submit"
				className="w-full rounded-2xl bg-neutral-900 px-4 sm:px-6 py-3 text-base sm:text-lg font-medium text-white transition-all hover:bg-neutral-800 hover:shadow-lg active:scale-95 whitespace-nowrap"
			>
				Add Circle
			</button>
		</form>
	);
};
