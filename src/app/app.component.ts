import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnakeGameComponent } from './components/snake-game/snake-game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, SnakeGameComponent],
})
export class AppComponent {
  title = 'snake-game-resolveAI';
}
