import { Component, OnInit,HostBinding, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  gridSize: number = 10;
  grid: number[] = [];

  fruitIndex: number = 0;
  snake: any;

@HostBinding('tabIndex') tabIndex:string;//tabIndexを付与するため、ComponentにtabIndexをバインドするメンバを用意

  constructor() {
  this.tabIndex="0";
    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      this.grid[i] = i;
    }
  }

  ngOnInit() {
    this._initilizeGame();
  }

  private _initilizeGame() {
    this.snake = {
      headPos: {
        x: 1,
        y: 3,
      },

      bodyIndexes: [],
      direction: '→',
      speed: 400,
    };
    this._randomizeFruitIndex();
  }

  @HostListener('keydown', ['$event'])
  onKeyUp(event: any) {
    switch (event.keyCode) {
      case 37:
        if (this.snake.direction !== '→') {
          this.snake.direction = '←';
        }
        break;

      case 38:
        if (this.snake.direction !== '↓') {
          this.snake.direction = '↑';
        }
        break;

      case 39:
        if (this.snake.direction !== '←') {
          this.snake.direction = '→';
        }
        break;

      case 40:
        if (this.snake.direction !== '↑') {
          this.snake.direction = '↓';
        }
        break;
    }
  }

  public snakeHeadIndex(): number {
    if (this._isFrameout()) return null;
    return this.snake.headPos.y * this.gridSize + this.snake.headPos.x;
  }

  private _isSuicided(): boolean {
    return this.snake.bodyIndexes.includes(this.snakeHeadIndex());
  }

  private _isFrameout(): boolean {
    const head = this.snake.headPos;
    return head.x < 0 || this.gridSize <= head.x || head.y < 0 || this.gridSize <= head.y;
  }

  public isGameover(): boolean {
    return (this._isSuicided() || this._isFrameout())
  }

  public timeGoes(): void {
    if (this.isGameover()) return;
    this._forwardSnake();

    // speedミリ秒後に自分自身を呼び出す
    setTimeout(this.timeGoes.bind(this), this.snake.speed);
  }

  private _forwardSnake(): void {
    // 体の最後尾を頭に持ってくる
    this.snake.bodyIndexes.shift();
    this.snake.bodyIndexes.push(this.snakeHeadIndex());

    // 頭を1マス移動
    switch (this.snake.direction) {
      case '←':
        this.snake.headPos.x--;
        break;
      case '↑':
        this.snake.headPos.y--;
        break;
      case '→':
        this.snake.headPos.x++;
        break;
      case '↓':
        this.snake.headPos.y++;
        break;
    }

    if (this._isEatingFruit()) {
      this._growUpSnake();
      this._randomizeFruitIndex();
    }
  }

  private _isEatingFruit(): boolean {
    return this.snakeHeadIndex() === this.fruitIndex;
  }

  private _growUpSnake(): void {
    this.snake.bodyIndexes.unshift(this.snake.bodyIndexes[0]);
  }

  private _randomizeFruitIndex(): void {
    this.fruitIndex = Math.floor(Math.random() * this.gridSize * this.gridSize); // 0 〜 99 の乱数
  }
}
