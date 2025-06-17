import { useEffect, useRef, useState } from "react";

const EarthSpinnerCanvas = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 240, height: 240 });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const sprite = new Image();
    sprite.src = "/earthspin-sheet.png";

    const FRAME_WIDTH = 48;
    const FRAME_HEIGHT = 48;
    const FRAMES_PER_ROW = 10;
    const TOTAL_FRAMES = 100;

    const SCALE_FACTOR = 4; // You can increase this if you want it larger
    const DISPLAY_WIDTH = FRAME_WIDTH * SCALE_FACTOR;
    const DISPLAY_HEIGHT = FRAME_HEIGHT * SCALE_FACTOR;

    let currentFrame = 0;
    let lastTime = 0;
    const FPS = 30; // Higher FPS for smoother feel
    const frameDelay = 1000 / FPS;

    const render = (timestamp) => {
      if (!sprite.complete) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      if (timestamp - lastTime >= frameDelay) {
        ctx.clearRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);

        const col = currentFrame % FRAMES_PER_ROW;
        const row = Math.floor(currentFrame / FRAMES_PER_ROW);

        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(
          sprite,
          col * FRAME_WIDTH,
          row * FRAME_HEIGHT,
          FRAME_WIDTH,
          FRAME_HEIGHT,
          0,
          0,
          DISPLAY_WIDTH,
          DISPLAY_HEIGHT
        );

        currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
        lastTime = timestamp;
      }

      animationRef.current = requestAnimationFrame(render);
    };

    canvas.width = DISPLAY_WIDTH;
    canvas.height = DISPLAY_HEIGHT;
    setDimensions({ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT });

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="mx-auto my-auto"
      style={{
        imageRendering: "auto", // Use default smoothing for natural feel
      }}
    />
  );
};

export default EarthSpinnerCanvas;
