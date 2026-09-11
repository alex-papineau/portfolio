import { describe, it, expect } from 'vitest';
import { stepGrid } from './game-of-life';

const makeGrid = (cols: number, rows: number, live: [number, number][]) => {
	const grid = Array.from({ length: cols }, () => new Uint8Array(rows));
	for (const [x, y] of live) grid[x][y] = 1;
	return grid;
};

const toCoords = (grid: Uint8Array[]) => {
	const coords: [number, number][] = [];
	grid.forEach((col, x) => col.forEach((cell, y) => cell && coords.push([x, y])));
	return coords;
};

describe('stepGrid', () => {
	it('kills a live cell with no neighbors (underpopulation)', () => {
		const grid = makeGrid(5, 5, [[2, 2]]);
		expect(toCoords(stepGrid(grid, 5, 5))).toEqual([]);
	});

	it('kills a live cell with 4+ neighbors (overpopulation)', () => {
		const grid = makeGrid(5, 5, [
			[2, 2],
			[1, 1],
			[1, 2],
			[1, 3],
			[3, 2],
		]);
		expect(stepGrid(grid, 5, 5)[2][2]).toBe(0);
	});

	it('keeps a live cell with 2 or 3 neighbors', () => {
		const grid = makeGrid(5, 5, [
			[2, 2],
			[1, 2],
			[3, 2],
		]);
		expect(stepGrid(grid, 5, 5)[2][2]).toBe(1);
	});

	it('revives a dead cell with exactly 3 neighbors', () => {
		const grid = makeGrid(5, 5, [
			[1, 2],
			[2, 2],
			[3, 2],
		]);
		expect(stepGrid(grid, 5, 5)[2][1]).toBe(1);
	});

	it('oscillates a blinker with period 2', () => {
		const vertical = makeGrid(5, 5, [
			[2, 1],
			[2, 2],
			[2, 3],
		]);
		const horizontal = stepGrid(vertical, 5, 5);
		expect(toCoords(horizontal).sort()).toEqual([
			[1, 2],
			[2, 2],
			[3, 2],
		]);
		expect(toCoords(stepGrid(horizontal, 5, 5)).sort()).toEqual(toCoords(vertical).sort());
	});

	it('wraps neighbor counting around grid edges (toroidal)', () => {
		// Three cells straddling the right/left edge should behave like a horizontal blinker
		const grid = makeGrid(5, 5, [
			[4, 2],
			[0, 2],
			[1, 2],
		]);
		const next = stepGrid(grid, 5, 5);
		expect(next[0][1]).toBe(1);
		expect(next[0][3]).toBe(1);
	});
});
