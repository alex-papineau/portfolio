const GATE_PASSWORD = 'password';

document.addEventListener('DOMContentLoaded', () => {
  const gate = document.getElementById('password-gate');
  const form = document.getElementById('password-form') as HTMLFormElement | null;
  const input = document.getElementById('gate-password') as HTMLInputElement | null;
  const errorMsg = document.getElementById('password-error');
  const eyesContainer = document.getElementById('eyes-container');
  const largePupil = document.querySelector('.large-eye-pupil') as HTMLElement | null;
  const largeEye = document.getElementById('large-eye');

  if (!gate) return;

  // Check auth status
  // Always lock scroll on load. No session storage check since it should appear on every load.
  document.body.style.overflow = 'hidden';

  // Populate background small eyes
  const eyeWidth = 80;
  const eyeHeight = 50;
  const cols = Math.ceil(window.innerWidth / eyeWidth);
  const rows = Math.ceil(window.innerHeight / eyeHeight);
  
  interface SmallEye {
    element: HTMLElement;
    container: HTMLElement;
  }
  const smallEyes: SmallEye[] = [];

  if (eyesContainer) {
    for (let i = 0; i < cols * rows; i++) {
      const eyeDiv = document.createElement('div');
      eyeDiv.className = 'small-eye';
      
      const outline = document.createElement('span');
      outline.className = 'small-eye-outline';
      outline.innerHTML = '&lt; &gt;'; // < >
      
      const pupil = document.createElement('span');
      pupil.className = 'small-eye-pupil';
      pupil.innerText = 'o';

      eyeDiv.appendChild(outline);
      eyeDiv.appendChild(pupil);
      eyesContainer.appendChild(eyeDiv);

      smallEyes.push({
        element: pupil,
        container: eyeDiv
      });
    }
  }

  // Track Mouse
  document.addEventListener('mousemove', (e) => {
    if (gate.classList.contains('hidden')) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Update large eye
    if (largeEye && largePupil) {
      const rect = largeEye.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;
      
      const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
      const distance = Math.min(
        Math.hypot(mouseX - eyeCenterX, mouseY - eyeCenterY) / 10,
        25 // max radius for pupil inside the large eye
      );

      const px = Math.cos(angle) * distance;
      const py = Math.sin(angle) * distance;
      
      largePupil.style.transform = `translate(${px}px, ${py}px)`;
    }

    // Update small eyes
    smallEyes.forEach(eye => {
      const rect = eye.container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const angle = Math.atan2(mouseY - cy, mouseX - cx);
      // Small eyes have a tiny constrained radius
      const px = Math.cos(angle) * 6;
      const py = Math.sin(angle) * 4;

      eye.element.style.transform = `translate(${px}px, ${py}px)`;
    });
  });

  // Handle Auth
  if (form && input && errorMsg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value === GATE_PASSWORD) {
        gate.classList.add('hidden');
        document.body.style.overflow = 'auto';
      } else {
        errorMsg.innerText = 'ACCESS DENIED';
        input.value = '';
        input.focus();
        setTimeout(() => { errorMsg.innerText = ''; }, 2000);
      }
    });
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    // Re-populate background eyes efficiently could go here
    // For simplicity, sticking to the initial grid is fine unless major resizing happens
  });
});
