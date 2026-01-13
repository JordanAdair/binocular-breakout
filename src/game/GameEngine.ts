// GameEngine: Pure game logic, no rendering or browser APIs
import type { GameState, InputState, Paddle, Ball, Brick } from './types';

// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_SPEED = 8;
const BALL_RADIUS = 8;
const BALL_SPEED = 5;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_WIDTH = 70;
const BRICK_HEIGHT = 25;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 60;
const BRICK_OFFSET_LEFT = 35;

export class GameEngine {
    private state: GameState;
    private input: InputState;

    constructor() {
        this.state = this.initializeState();
        this.input = {
            left: false,
            right: false,
            mouseX: CANVAS_WIDTH / 2,
        };
    }

    private initializeState(): GameState {
        const bricks: Brick[] = [];

        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLS; col++) {
                bricks.push({
                    x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
                    y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
                    width: BRICK_WIDTH,
                    height: BRICK_HEIGHT,
                    alive: true,
                });
            }
        }

        return {
            paddle: {
                x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
                y: CANVAS_HEIGHT - 40,
                width: PADDLE_WIDTH,
                height: PADDLE_HEIGHT,
                speed: PADDLE_SPEED,
            },
            ball: {
                x: CANVAS_WIDTH / 2,
                y: CANVAS_HEIGHT / 2,
                vx: BALL_SPEED * 0.7,
                vy: -BALL_SPEED,
                radius: BALL_RADIUS,
                speed: BALL_SPEED,
            },
            bricks,
            score: 0,
            paused: false,
            gameOver: false,
        };
    }

    public getState(): GameState {
        return this.state;
    }

    public setInput(input: Partial<InputState>): void {
        this.input = { ...this.input, ...input };
    }

    public togglePause(): void {
        this.state.paused = !this.state.paused;
    }

    public reset(): void {
        this.state = this.initializeState();
    }

    public update(dt: number): void {
        if (this.state.paused || this.state.gameOver) return;

        this.updatePaddle(dt);
        this.updateBall(dt);
        this.checkCollisions();
        this.checkWinCondition();
    }

    private updatePaddle(dt: number): void {
        const { paddle } = this.state;

        // Keyboard control
        if (this.input.left) {
            paddle.x -= paddle.speed;
        }
        if (this.input.right) {
            paddle.x += paddle.speed;
        }

        // Mouse control (overrides keyboard)
        paddle.x = this.input.mouseX - paddle.width / 2;

        // Keep paddle within bounds
        paddle.x = Math.max(0, Math.min(CANVAS_WIDTH - paddle.width, paddle.x));
    }

    private updateBall(dt: number): void {
        const { ball } = this.state;

        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wall collisions (left and right)
        if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= CANVAS_WIDTH) {
            ball.vx *= -1;
            ball.x = Math.max(ball.radius, Math.min(CANVAS_WIDTH - ball.radius, ball.x));
        }

        // Top wall collision
        if (ball.y - ball.radius <= 0) {
            ball.vy *= -1;
            ball.y = ball.radius;
        }

        // Bottom boundary (game over)
        if (ball.y - ball.radius > CANVAS_HEIGHT) {
            this.state.gameOver = true;
        }
    }

    private checkCollisions(): void {
        this.checkPaddleCollision();
        this.checkBrickCollisions();
    }

    private checkPaddleCollision(): void {
        const { ball, paddle } = this.state;

        if (
            ball.y + ball.radius >= paddle.y &&
            ball.y - ball.radius <= paddle.y + paddle.height &&
            ball.x >= paddle.x &&
            ball.x <= paddle.x + paddle.width
        ) {
            // Reflect ball upward
            ball.vy = -Math.abs(ball.vy);
            ball.y = paddle.y - ball.radius;

            // Add horizontal velocity based on hit position
            const hitPos = (ball.x - paddle.x) / paddle.width;
            ball.vx = (hitPos - 0.5) * ball.speed * 2;
        }
    }

    private checkBrickCollisions(): void {
        const { ball, bricks } = this.state;

        for (const brick of bricks) {
            if (!brick.alive) continue;

            if (
                ball.x + ball.radius >= brick.x &&
                ball.x - ball.radius <= brick.x + brick.width &&
                ball.y + ball.radius >= brick.y &&
                ball.y - ball.radius <= brick.y + brick.height
            ) {
                brick.alive = false;
                this.state.score += 10;

                // Simple collision response
                const fromLeft = Math.abs(ball.x - brick.x);
                const fromRight = Math.abs(ball.x - (brick.x + brick.width));
                const fromTop = Math.abs(ball.y - brick.y);
                const fromBottom = Math.abs(ball.y - (brick.y + brick.height));

                const minDist = Math.min(fromLeft, fromRight, fromTop, fromBottom);

                if (minDist === fromLeft || minDist === fromRight) {
                    ball.vx *= -1;
                } else {
                    ball.vy *= -1;
                }

                break; // Only process one brick per frame
            }
        }
    }

    private checkWinCondition(): void {
        const allBricksDestroyed = this.state.bricks.every(b => !b.alive);
        if (allBricksDestroyed) {
            this.state.gameOver = true;
        }
    }
}