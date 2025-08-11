import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ImageStage } from "./components/ImageStage.tsx";
import { CoordinateForm } from "./components/CoordinateForm.tsx";
import { MaterialSelector } from "./components/MaterialSelector.tsx";
import type { CircleData, Material } from "./types.ts";
import { computePercentages } from "./utils/coords.ts";
import SampleImage from "../../assets/SampleImage.jpg";

export const DesignerPage = () => {
	const [circles, setCircles] = useState<CircleData[]>([]);
	const [material, setMaterial] = useState<Material>("glass");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [stageSize, setStageSize] = useState<{ w: number; h: number }>({
		w: 0,
		h: 0,
	});

	const handleAdd = (x: number, y: number) => {
		const newCircle = { id: crypto.randomUUID(), x, y, radius: 16 };

		const wouldOverlap = circles.some((circle) => {
			const dx = circle.x - newCircle.x;
			const dy = circle.y - newCircle.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			return distance < circle.radius + newCircle.radius;
		});

		if (wouldOverlap) {
			toast.error(
				"Please choose different coordinates to avoid overlapping with existing circles.",
				{
					style: {
						background: "#fef2f2",
						border: "1px solid #fecaca",
						color: "#dc2626",
					},
				},
			);
			return;
		}

		setCircles((prev) => [...prev, newCircle]);
		setSelectedId(newCircle.id);
	};

	const handleMove = (id: string, x: number, y: number) => {
		setCircles((prev) => prev.map((c) => (c.id === id ? { ...c, x, y } : c)));
	};

	const handleSubmit = (stageW: number, stageH: number) => {
		const withPercent = circles.map((c) => ({
			id: c.id,
			pixel: { x: c.x, y: c.y },
			percent: computePercentages({ x: c.x, y: c.y }, stageW, stageH),
		}));
		console.log({ circles: withPercent, material });
		toast.success("Form submitted! To see values, check the console.", {
			style: {
				background: "#f0fdf4",
				border: "1px solid #bbf7d0",
				color: "#16a34a",
			},
		});
	};

	const selectedCircle = useMemo(
		() => circles.find((c) => c.id === selectedId) ?? circles[0],
		[circles, selectedId],
	);

	return (
		<main className="min-h-screen bg-neutral-50">
			<div className="mx-auto max-w-7xl px-8 py-12 min-w-sm">
				<div className="flex flex-col lg:flex-row gap-12">
					<div className="flex-1">
						<div className="glass rounded-3xl p-8 shadow-lg">
							<ImageStage
								src={SampleImage}
								circles={circles}
								onMove={handleMove}
								onSubmit={handleSubmit}
								onSelect={setSelectedId}
								onSizeChange={() => {}}
								selectedId={selectedId}
								onStageSizeChange={setStageSize}
							/>
						</div>
					</div>

					<div className="lg:w-96 space-y-6 lg:sticky lg:top-12 h-fit min-w-2xs">
						<div className="glass rounded-3xl p-8 shadow-lg">
							<CoordinateForm
								onAdd={handleAdd}
								values={selectedCircle}
								stageSize={stageSize}
							/>
						</div>
						<div className="glass rounded-3xl p-8 shadow-lg">
							<MaterialSelector selected={material} onChange={setMaterial} />
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};
