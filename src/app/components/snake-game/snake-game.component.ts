import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

interface Position {
  x: number;
  y: number;
}

@Component({
  selector: 'snake-game',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.scss'],
})
export class SnakeGameComponent implements OnInit {
  @ViewChild('gameCanvas', { static: true })
  gameCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private snake: Position[] = [];
  private direction: Position = { x: 1, y: 0 };
  private food: Position = { x: 0, y: 0 };
  private gameInterval!: number;
  private readonly gridSize = 20;
  private isGameRunning = false;
  foodEaten = 0;
  private initialSpeed = 200;
  private speedIncreaseThreshold = 5;
  private snakeSize = 15;
  private foodSize = 10;

  constructor() {}

  ngOnInit(): void {
    this.ctx = this.gameCanvas.nativeElement.getContext('2d')!;
    this.resetGame();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isGameRunning) return;
    switch (event.key) {
      case 'ArrowUp':
        if (this.direction.y === 0) this.direction = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (this.direction.y === 0) this.direction = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (this.direction.x === 0) this.direction = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (this.direction.x === 0) this.direction = { x: 1, y: 0 };
        break;
    }
  }

  startGame() {
    if (this.isGameRunning) return;
    this.resetGame();
    this.isGameRunning = true;
    this.setGameSpeed(this.initialSpeed);
  }

  private resetGame() {
    this.snake = [{ x: 10, y: 10 }];
    this.direction = { x: 1, y: 0 };
    this.foodEaten = 0;
    this.placeFood();
  }

  private setGameSpeed(speed: number) {
    clearInterval(this.gameInterval);
    this.gameInterval = window.setInterval(() => this.gameLoop(), speed);
  }

  private gameLoop() {
    this.update();
    this.draw();
  }

  private update() {
    const head = {
      x: this.snake[0].x + this.direction.x,
      y: this.snake[0].y + this.direction.y,
    };

    if (this.isGameOver(head)) {
      this.isGameRunning = false;
      clearInterval(this.gameInterval);
      alert('Game Over!');
      return;
    }

    this.snake.unshift(head);

    if (this.snake[0].x === this.food.x && this.snake[0].y === this.food.y) {
      this.foodEaten++;
      this.placeFood();
      if (this.foodEaten % this.speedIncreaseThreshold === 0) {
        const newSpeed = Math.max(
          50,
          this.initialSpeed -
            (this.foodEaten / this.speedIncreaseThreshold) * 20
        );
        this.setGameSpeed(newSpeed);
      }
    } else {
      this.snake.pop();
    }
  }

  private isGameOver(head: Position) {
    return (
      head.x < 0 ||
      head.x >= this.gridSize ||
      head.y < 0 ||
      head.y >= this.gridSize ||
      this.snake.some((segment) => segment.x === head.x && segment.y === head.y)
    );
  }

  private placeFood() {
    let newFoodPosition: Position;
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize),
      };
    } while (
      this.snake.some(
        (segment) =>
          segment.x === newFoodPosition.x && segment.y === newFoodPosition.y
      )
    );
    this.food = newFoodPosition;
  }

  private draw() {
    this.ctx.clearRect(
      0,
      0,
      this.gameCanvas.nativeElement.width,
      this.gameCanvas.nativeElement.height
    );

    // Draw snake
    this.ctx.fillStyle = 'green';
    for (const segment of this.snake) {
      this.ctx.fillRect(
        segment.x * this.gridSize,
        segment.y * this.gridSize,
        this.snakeSize,
        this.snakeSize
      );
    }

    // Draw food
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(
      this.food.x * this.gridSize,
      this.food.y * this.gridSize,
      this.foodSize,
      this.foodSize
    );
  }
}
