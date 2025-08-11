import * as ToggleGroup from "@radix-ui/react-toggle-group";
import type { Material } from "../types.ts";

const materials: {
	key: Material;
	label: string;
	price: string;
	description: string;
}[] = [
	{
		key: "glass",
		label: "Glass",
		price: "€299",
		description: "Premium transparent finish",
	},
	{
		key: "aluminium",
		label: "Aluminium",
		price: "€399",
		description: "Lightweight metallic finish",
	},
	{
		key: "steel",
		label: "Steel",
		price: "€499",
		description: "Durable industrial finish",
	},
	{
		key: "wood",
		label: "Wood",
		price: "€599",
		description: "Natural warm finish",
	},
	{
		key: "stone",
		label: "Stone",
		price: "€699",
		description: "Luxury stone finish",
	},
];

export const MaterialSelector = ({
	selected,
	onChange,
}: {
	selected: Material;
	onChange: (m: Material) => void;
}) => {
	const handleValueChange = (value: string) => {
		if (value) {
			const currentScrollY = window.scrollY;
			onChange(value as Material);

			requestAnimationFrame(() => {
				if (window.scrollY !== currentScrollY) {
					window.scrollTo(0, currentScrollY);
				}
			});
		}
	};
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
					Material
				</h2>
				<p className="text-neutral-600">
					Choose your preferred material finish
				</p>
			</div>
			<ToggleGroup.Root
				type="single"
				value={selected}
				onValueChange={handleValueChange}
				className="grid grid-cols-1 gap-3"
			>
				{materials.map((m) => (
					<ToggleGroup.Item
						key={m.key}
						value={m.key}
						className="group flex items-center justify-between rounded-2xl border-2 border-neutral-200 bg-white px-6 py-4 transition-all hover:shadow-sm hover:border-neutral-300 data-[state=on]:border-blue-500 data-[state=on]:shadow-md"
					>
						<div className="flex flex-col">
							<span className="text-xl text-left font-semibold text-neutral-900">
								{m.label}
							</span>
							<span className="text-sm text-neutral-600 mt-1">
								{m.description}
							</span>
						</div>
						<div className="flex flex-col items-end">
							<span className="text-lg font-medium text-neutral-900">
								{m.price}
							</span>
						</div>
					</ToggleGroup.Item>
				))}
			</ToggleGroup.Root>
		</div>
	);
};
