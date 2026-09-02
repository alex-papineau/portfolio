// Initialize Conway's Game of Life simulation
const initGameOfLife = () => {
	// Get canvas and context
	const canvas = document.getElementById("gol-canvas") as HTMLCanvasElement;
	if (!canvas) return;

	const ctx = canvas.getContext("2d")!;
	// Get UI button elements
	const btnPlay = document.getElementById("btn-play");
	const btnClear = document.getElementById("btn-clear");
	const btnRandom = document.getElementById("btn-random");
	const genCount = document.getElementById("gen-count");

	// Grid dimensions and configuration
	const size = 8;
	const cols = Math.floor(canvas.width / size);
	const rows = Math.floor(canvas.height / size);

	// Game state variables
	let grid = Array.from({ length: cols }, () => new Uint8Array(rows));
	let running = false;
	let frame: number;
	let last = 0;
	let gen = 0;

	// Populate grid with random cells
	const randomize = () => {
		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++) grid[x][y] = Math.random() > 0.82 ? 1 : 0;
		}
		gen = 0;
		if (genCount) genCount.textContent = "0";
		draw();
	};

	// Draw current grid state
	const draw = () => {
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#fff";
		ctx.beginPath();
		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++) {
				if (grid[x][y]) ctx.rect(x * size, y * size, size, size);
			}
		}
		ctx.fill();
	};

	// Apply Conway's Game of Life rules to advance one generation
	const step = () => {
		const next = Array.from({ length: cols }, () => new Uint8Array(rows));
		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++) {
				// Count live neighbors
				let count = 0;
				for (let dx = -1; dx <= 1; dx++) {
					for (let dy = -1; dy <= 1; dy++) {
						if (!dx && !dy) continue;
						count += grid[(x + dx + cols) % cols][(y + dy + rows) % rows];
					}
				}
				// Apply game rules
				next[x][y] = count === 3 || (grid[x][y] === 1 && count === 2) ? 1 : 0;
			}
		}
		grid = next;
		gen++;
		if (genCount) genCount.textContent = String(gen);
	};

	// Animation loop for continuous simulation
	const loop = (t: number) => {
		if (!running) return;
		if (t - last >= 65) {
			step();
			draw();
			last = t;
		}
		frame = requestAnimationFrame(loop);
	};

	// Handle canvas clicks to toggle cell states
	canvas.onclick = (e) => {
		const rect = canvas.getBoundingClientRect();
		const x = Math.floor(((e.clientX - rect.left) * (canvas.width / rect.width)) / size);
		const y = Math.floor(((e.clientY - rect.top) * (canvas.height / rect.height)) / size);
		if (x >= 0 && x < cols && y >= 0 && y < rows) {
			grid[x][y] = grid[x][y] ? 0 : 1;
			draw();
		}
	};

	// Play/Pause button handler
	btnPlay?.addEventListener("click", () => {
		running = !running;
		btnPlay.textContent = running ? "[ Pause ]" : "[ Play ]";
		if (running) {
			last = performance.now();
			frame = requestAnimationFrame(loop);
		} else {
			cancelAnimationFrame(frame);
		}
	});

	// Clear grid button handler
	btnClear?.addEventListener("click", () => {
		running = false;
		if (btnPlay) btnPlay.textContent = "[ Play ]";
		cancelAnimationFrame(frame);
		grid = Array.from({ length: cols }, () => new Uint8Array(rows));
		gen = 0;
		if (genCount) genCount.textContent = "0";
		draw();
	});

	// Random grid button handler
	btnRandom?.addEventListener("click", randomize);

	// Cleanup when navigating away (Astro framework)
	document.addEventListener("astro:before-swap", () => {
		running = false;
		cancelAnimationFrame(frame);
	}, { once: true });

	randomize();
};

// Initialize on page load
document.addEventListener("astro:page-load", initGameOfLife);
if (document.readyState === "complete" || document.readyState === "interactive") {
	initGameOfLife();
} else {
	document.addEventListener("DOMContentLoaded", initGameOfLife);
}

export {};
