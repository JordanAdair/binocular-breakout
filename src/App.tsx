import { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/GameEngine';
import { CanvasRenderer } from './rendering/CanvasRenderer';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const [, forceUpdate] = useState({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize engine and renderer
    const engine = new GameEngine();
    const renderer = new CanvasRenderer(canvas);
    engineRef.current = engine;
    rendererRef.current = renderer;

    // Input handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') engine.setInput({ left: true });
      if (e.key === 'ArrowRight') engine.setInput({ right: true });
      if (e.key === ' ') {
        e.preventDefault();
        engine.togglePause();
        forceUpdate({});
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') engine.setInput({ left: false });
      if (e.key === 'ArrowRight') engine.setInput({ right: false });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      engine.setInput({ mouseX });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    // Game loop
    const gameLoop = (currentTime: number) => {
      const dt = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      engine.update(dt);
      renderer.render(engine.getState());

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const handleReset = () => {
    engineRef.current?.reset();
    forceUpdate({});
  };

  const handlePause = () => {
    engineRef.current?.togglePause();
    forceUpdate({});
  };

  const state = engineRef.current?.getState();

  return (
    <div className="app">
      <h1>Binocular Breakout</h1>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas"
      />

      <div className="controls">
        <button onClick={handlePause} className="btn">
          {state?.paused ? 'Resume' : 'Pause'} (Space)
        </button>

        <button onClick={handleReset} className="btn btn-secondary">
          Reset Game
        </button>
      </div>

      <div className="instructions">
        <h3>Controls</h3>
        <p>← → Arrow keys or move your mouse</p>
        <p>Space to pause/resume</p>
        <p className="note">⚠️ Prototype - dichoptic features coming soon</p>
      </div>
    </div>
  );
}

export default App;