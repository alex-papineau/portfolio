const initGameOfLife = () => {
	const canvas = document.getElementById("gol-canvas") as HTMLCanvasElement;
	if (!canvas) return;

	const ctx = canvas.getContext("2d")!;
	const btnPlay = document.getElementById("btn-play") as HTMLButtonElement;
	const btnClear = document.getElementById("btn-clear") as HTMLButtonElement;
	const btnRandom = document.getElementById("btn-random") as HTMLButtonElement;
	const genCount = document.getElementById("gen-count") as HTMLSpanElement;

	const CELL_SIZE = 8;
	// Logical size of the simulation
	const COLS = Math.floor(canvas.width / CELL_SIZE);
	const ROWS = Math.floor(canvas.height / CELL_SIZE);

	let grid = buildGrid();
	let isPlaying = false;
	let animationId: number;
	let lastTime = 0;
	const FPS = 15;
	const frameDelay = 1000 / FPS;
	let generations = 0;

	function buildGrid() {
		return new Array(COLS).fill(null).map(() => new Array(ROWS).fill(0));
	}

	function randomizeGrid() {
		for (let c = 0; c < COLS; c++) {
			for (let r = 0; r < ROWS; r++) {
				grid[c][r] = Math.random() > 0.85 ? 1 : 0;
			}
		}
		generations = 0;
		updateStats();
		drawGrid();
	}

	function drawGrid() {
		// Fill background
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Draw live cells
		ctx.fillStyle = "#fff";
		ctx.beginPath();
		for (let c = 0; c < COLS; c++) {
			for (let r = 0; r < ROWS; r++) {
				if (grid[c][r] === 1) {
					// We can use rects for better performance than filling individually each time
					ctx.rect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
				}
			}
		}
		ctx.fill();
	}

	function nextGen() {
		const nextGrid = buildGrid();

		for (let c = 0; c < COLS; c++) {
			for (let r = 0; r < ROWS; r++) {
				const state = grid[c][r];

				// Count alive neighbors (with wrapping edges - toroidal)
				let neighbors = 0;
				for (let i = -1; i < 2; i++) {
					for (let j = -1; j < 2; j++) {
						if (i === 0 && j === 0) continue;
						const x = (c + i + COLS) % COLS;
						const y = (r + j + ROWS) % ROWS;
						neighbors += grid[x][y];
					}
				}

				// Apply Conway's rules
				if (state === 0 && neighbors === 3) {
					nextGrid[c][r] = 1;
				} else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
					nextGrid[c][r] = 0;
				} else {
					nextGrid[c][r] = state;
				}
			}
		}
		grid = nextGrid;
		generations++;
	}

	function update(time: number) {
		if (!isPlaying) return;

		if (time - lastTime >= frameDelay) {
			nextGen();
			drawGrid();
			updateStats();
			lastTime = time;
		}

		animationId = requestAnimationFrame(update);
	}

	function togglePlay() {
		isPlaying = !isPlaying;
		btnPlay.textContent = isPlaying ? "[ PAUSE ]" : "[ PLAY ]";
		if (isPlaying) {
			lastTime = performance.now();
			animationId = requestAnimationFrame(update);
		} else {
			cancelAnimationFrame(animationId);
		}
	}

	function clearGrid() {
		isPlaying = false;
		btnPlay.textContent = "[ PLAY ]";
		cancelAnimationFrame(animationId);
		grid = buildGrid();
		generations = 0;
		updateStats();
		drawGrid();
	}

	function updateStats() {
		if (genCount) genCount.textContent = Math.floor(generations).toString();
	}

	// Toggle cells on click
	canvas.addEventListener("click", (e) => {
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;

		const x = (e.clientX - rect.left) * scaleX;
		const y = (e.clientY - rect.top) * scaleY;

		const c = Math.floor(x / CELL_SIZE);
		const r = Math.floor(y / CELL_SIZE);

		if (c >= 0 && c < COLS && r >= 0 && r < ROWS) {
			grid[c][r] = grid[c][r] ? 0 : 1;
			drawGrid();
		}
	});

	// Bind buttons
	if (btnPlay) btnPlay.addEventListener("click", togglePlay);
	if (btnClear) btnClear.addEventListener("click", clearGrid);
	if (btnRandom) btnRandom.addEventListener("click", randomizeGrid);

	// Cleanup on page transition
	document.addEventListener("astro:before-swap", () => {
		isPlaying = false;
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
	}, { once: true });

	// Startup
	randomizeGrid();
	drawGrid();
};

// Initialize on page load and astro page transitions
document.addEventListener("astro:page-load", initGameOfLife);
if (document.readyState === "complete" || document.readyState === "interactive") {
	setTimeout(initGameOfLife, 0);
} else {
	document.addEventListener("DOMContentLoaded", initGameOfLife);
}

export {};
