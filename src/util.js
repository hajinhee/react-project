export const myConfetti = window.confetti.create(
  document.querySelector("#confetti-canvas"),
  {
    resize: true,
    useWorker: true,
  }
);
