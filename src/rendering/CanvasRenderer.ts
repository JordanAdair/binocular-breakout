// CanvasRenderer: Pure drawing logic, receives state and renders it
import type { GameState, Paddle, Ball, Brick } from '../game/types';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const BRICK_COLS = 10;

export class CanvasRenderer {
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get 2D context');
        }
        this.ctx = ctx;
    }

    public render(state: GameState): void {
        this.clear();
        this.drawBricks(state.bricks);
        this.drawPaddle(state.paddle);
        this.drawBall(state.ball);
        this.drawScore(state.score);

        if (state.paused) {
            this.drawOverlay('PAUSED');
        }

        if (state.gameOver) {
            const message = state.bricks.every(b => !b.alive) ? 'YOU WIN!' : 'GAME OVER';
            this.drawOverlay(message);
        }
    }

    private clear(): void {
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    private drawPaddle(paddle: Paddle): void {
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    private drawBall(ball: Ball): void {
        this.ctx.fillStyle = '#2196F3';
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    private drawBricks(bricks: Brick[]): void {
        bricks.forEach((brick, i) => {
            if (!brick.alive) return;

            // Rainbow colors by row
            const row = Math.floor(i / BRICK_COLS);
            const hue = (row * 360) / 5; // 5 rows
            this.ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;

            this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

            // Border
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        });
    }

    private drawScore(score: number): void {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${score}`, 10, 30);
    }

    private drawOverlay(text: string): void {
        // Semi-transparent background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 48px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
}