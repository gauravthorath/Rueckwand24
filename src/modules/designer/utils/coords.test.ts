import { describe, it, expect } from "vitest";
import { clampPoint, circlesCollide, computePercentages } from "./coords";

describe("coords utils", () => {
	it("clamps point within bounds", () => {
		expect(clampPoint({ x: -10, y: 500 }, 200, 100, 10)).toEqual({
			x: 10,
			y: 90,
		});
		expect(clampPoint({ x: 210, y: -5 }, 200, 100, 10)).toEqual({
			x: 190,
			y: 10,
		});
	});

	it("detects collision", () => {
		const a = { x: 50, y: 50, radius: 10 };
		const b = { x: 60, y: 50, radius: 10 };
		expect(circlesCollide(a, b)).toBe(true);
		const c = { x: 100, y: 100, radius: 10 };
		expect(circlesCollide(a, c)).toBe(false);
	});

	it("computes percentages with 2 decimals", () => {
		const p = computePercentages({ x: 50, y: 25 }, 200, 100);
		expect(p).toEqual({ x: 25, y: 25 });
	});
});
