// Core game types for Issue #1

export interface Vec2 {
    x: number;
    y: number;
}

export interface Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
}

export interface Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    speed: number;
}

export interface Brick {
    x: number;
    y: number;
    width: number;
    height: number;
    alive: boolean;
}

export interface GameState {
    paddle: Paddle;
    ball: Ball;
    bricks: Brick[];
    score: number;
    paused: boolean;
    gameOver: boolean;
}

export interface InputState {
    left: boolean;
    right: boolean;
    mouseX: number;
}