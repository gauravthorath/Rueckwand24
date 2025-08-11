import {
	useEffect,
	useRef,
	useState,
	type MouseEvent as ReactMouseEvent,
} from "react";
import type { CircleData } from "../types";
import { clampPoint } from "../utils/coords";

type Props = {
	src: string;
	circles: CircleData[];
	onMove: (id: string, x: number, y: number) => void;
	onSubmit: (w: number, h: number) => void;
	onSelect?: (id: string | null) => void;
	onSizeChange?: (w: number, h: number) => void;
	selectedId?: string | null;
	onStageSizeChange?: (size: { w: number; h: number }) => void;
};

export const ImageStage = ({
	src,
	circles,
	onMove,
	onSubmit,
	onSelect,
	onSizeChange,
	selectedId,
	onStageSizeChange,
}: Props) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [stageSize, setStageSize] = useState<{ w: number; h: number }>({
		w: 0,
		h: 0,
	});
	const [activeId, setActiveId] = useState<string | null>(null);
	const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
		null,
	);

	useEffect(() => {
		if (!containerRef.current) return;
		const el = containerRef.current;
		const ro = new ResizeObserver(() => {
			const rect = el.getBoundingClientRect();
			const newSize = { w: rect.width, h: rect.height };
			setStageSize(newSize);
			onSizeChange?.(rect.width, rect.height);
			onStageSizeChange?.(newSize);
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, [onSizeChange, onStageSizeChange]);

	const onMouseDown = (e: ReactMouseEvent, circle: CircleData) => {
		e.stopPropagation();
		setActiveId(circle.id);
		onSelect?.(circle.id);
		const rect = containerRef.current?.getBoundingClientRect();
		if (!rect) return;
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		setDragOffset({ x: mouseX - circle.x, y: mouseY - circle.y });
	};

	useEffect(() => {
		if (!activeId || !dragOffset) return;

		let lastUpdate = 0;
		const throttleMs = 16;

		const onMoveHandler = (e: MouseEvent) => {
			const now = Date.now();
			if (now - lastUpdate < throttleMs) return;
			lastUpdate = now;

			if (!containerRef.current) return;
			const rect = containerRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left - dragOffset.x;
			const y = e.clientY - rect.top - dragOffset.y;

			const current = circles.find((c) => c.id === activeId);
			if (!current) return;

			const clamped = clampPoint(
				{ x, y },
				rect.width,
				rect.height,
				current.radius,
			);

			if (
				clamped.x >= 0 &&
				clamped.x <= rect.width &&
				clamped.y >= 0 &&
				clamped.y <= rect.height
			) {
				// Optimized collision detection - only check if there are other circles
				const otherCircles = circles.filter((c) => c.id !== activeId);
				if (otherCircles.length > 0) {
					const wouldCollide = otherCircles.some((c) => {
						const dx = c.x - clamped.x;
						const dy = c.y - clamped.y;
						const distance = Math.sqrt(dx * dx + dy * dy);
						return distance < c.radius + current.radius;
					});
					if (wouldCollide) return;
				}

				onMove(activeId, clamped.x, clamped.y);
			}
		};

		const onUp = () => {
			setActiveId(null);
			setDragOffset(null);
		};

		window.addEventListener("mousemove", onMoveHandler, { passive: true });
		window.addEventListener("mouseup", onUp);

		return () => {
			window.removeEventListener("mousemove", onMoveHandler);
			window.removeEventListener("mouseup", onUp);
		};
	}, [activeId, dragOffset, circles, onMove]);

	const handleStageClick = () => {
		onSelect?.(null);
	};

	return (
		<div className="space-y-6">
			<div
				ref={containerRef}
				className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-neutral-100 shadow-inner"
				onMouseDown={handleStageClick}
			>
				<img
					src={src}
					alt="stage"
					className="pointer-events-none size-full object-cover"
				/>

				{circles.map((c) => (
					<button
						type="button"
						key={c.id}
						aria-label="circle"
						onMouseDown={(e) => onMouseDown(e, c)}
						className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-3 bg-transparent shadow-xl focus:outline-none ${
							activeId === c.id
								? "border-blue-500"
								: selectedId === c.id
									? "border-red-500"
									: "border-red-500"
						} ${activeId !== c.id ? "hover:scale-110 transition-all" : ""}`}
						style={{
							left: c.x,
							top: c.y,
							width: c.radius * 2,
							height: c.radius * 2,
							transition: activeId === c.id ? "none" : undefined,
						}}
					/>
				))}
			</div>

			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div className="text-base sm:text-lg text-neutral-600 flex-1">
					{"Drag circles to move them, use form to add new circles"}
				</div>
				<button
					type="button"
					onClick={() => onSubmit(stageSize.w, stageSize.h)}
					className="rounded-2xl bg-neutral-900 px-4 sm:px-6 py-3 text-base sm:text-lg font-medium text-white transition-all hover:bg-neutral-800 hover:shadow-lg active:scale-95 whitespace-nowrap w-full sm:w-auto"
				>
					Submit
				</button>
			</div>
		</div>
	);
};
