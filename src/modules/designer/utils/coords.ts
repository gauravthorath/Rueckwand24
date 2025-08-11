import type { Point } from "../types.ts";

export const clampPoint = (
	p: Point,
	w: number,
	h: number,
	radius: number,
): Point => {
	const x = Math.min(Math.max(p.x, radius), w - radius);
	const y = Math.min(Math.max(p.y, radius), h - radius);
	return { x, y };
};

export const computePercentages = (p: Point, w: number, h: number) => {
	return {
		x: Math.round((p.x / w) * 10000) / 100,
		y: Math.round((p.y / h) * 10000) / 100,
	};
};

export const circlesCollide = (
	a: { x: number; y: number; radius: number },
	b: { x: number; y: number; radius: number },
): boolean => {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	const distSq = dx * dx + dy * dy;
	const minDist = a.radius + b.radius;
	return distSq < minDist * minDist;
};
