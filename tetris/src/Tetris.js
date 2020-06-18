import { getTetrominos } from './Tetromino.js';
import { ROTATE_CW0, GameFieldModel } from './GameFieldModel.js';
import { GameFieldView } from './GameFieldView.js';
import { ShardsAnimation } from './ShardsAnimation.js';
import { InfoPanel }  from './InfoPanel.js';
import { TETROMINO_COLORS } from './Colors.js';

// TODO: refactor and remove this dependency (VIEW_CELL_HEIGHT)
import { Settings } from './Settings.js';

import { CELLTYPE_BACKGROUND } from './CellTypes.js';


const GAME_STATE_INITIAL = 0;
const GAME_STATE_GAMEOVER = 1;
const GAME_STATE_PLAYING = 2;
const GAME_STATE_PAUSE = 3;
const GAME_STATE_HIGHSCORE_DIALOG = 4;

const GAME_INITIAL_LEVEL = 1;

const FIGURES = getTetrominos();


class Tetris {
  constructor(numRows, numColumns, cellWidth, cellHeight,
              nextFigureNumRows, nextFigureNumColumns) {

    this.model = new GameFieldModel(FIGURES, this.getStartFigure(numColumns),
      numRows, numColumns, CELLTYPE_BACKGROUND);

    this.nextFigureModel = new GameFieldModel(FIGURES, this.model.nextFigure,
      nextFigureNumRows, nextFigureNumColumns, CELLTYPE_BACKGROUND);

    this.view = new GameFieldView('.gameField', numRows, numColumns,
                                  cellWidth, cellHeight);

    this.nextFigureView = new GameFieldView('.nextFigure', nextFigureNumRows,
      nextFigureNumColumns, cellWidth / 1.5, cellHeight / 1.5);

    this.shardsAnimation = new ShardsAnimation(this.model, this.view, 2);

    this.infoPanel = new InfoPanel();

    this.updateTimer = null;
    this.updateInterval = null;
    this.gameState = GAME_STATE_INITIAL;
    this.currentScore = 0;
    this.totalLines = 0;
    this.level = GAME_INITIAL_LEVEL;

    this.highscoreList = [];
  }

  setHighscore(highscoreList) {
    this.highscoreList = highscoreList;

    const highscoreEntries = document.querySelectorAll('.highScoreEntry');
    for (const [i, entry] of highscoreEntries.entries()) {
      const nickNode = entry.querySelector('.highscore-nickname');
      const levelNode = entry.querySelector('.highscore-level');
      const scoreNode = entry.querySelector('.highscore-score');

      if (!(i in highscoreList)) break;

      const scoreInfo = highscoreList[i];

      if (scoreInfo.name && scoreInfo.level && scoreInfo.score) {
        const maxNameLength = 14;
        nickNode.textContent = String(scoreInfo.name).substr(0, maxNameLength);
        levelNode.textContent = scoreInfo.level;
        scoreNode.textContent = scoreInfo.score;
      }
    }
  }

  render() {
    this.model.constructWorld(this.gameState !== GAME_STATE_INITIAL);
    this.nextFigureModel.constructWorld(this.gameState !== GAME_STATE_INITIAL);

    this.view.render(this.model);
    this.nextFigureView.render(this.nextFigureModel);
    this.infoPanel.render(this.currentScore, this.totalLines, this.level);
  }

  update() {
    const { filledRows, canProceedFurther } =
      this.model.updateWorld(this.shardsAnimation);

    this.totalLines += filledRows.length;
    this.level = Math.floor(this.totalLines / 20) + GAME_INITIAL_LEVEL;
    this.updateInterval = this.levelToUpdateInterval(this.level);
    this.currentScore +=
      this.score(filledRows, this.model.totalRows, this.level);

    this.nextFigureModel.activeFigure = this.model.nextFigure;

    this.render();

    if (!canProceedFurther) {
      this.gameOver(this.gameState);
      return;
    }

    this.scheduleUpdate();
  }

  startNewGame() {
    const numRows = this.model.totalRows;
    const numColumns = this.model.totalColumns;
    const nextFigureNumRows = this.nextFigureModel.totalRows;
    const nextFigureNumColumns = this.nextFigureModel.totalColumns;

    this.model = new GameFieldModel(FIGURES, this.getStartFigure(numColumns),
      numRows, numColumns, CELLTYPE_BACKGROUND);

    this.nextFigureModel = new GameFieldModel(FIGURES, this.model.nextFigure,
      nextFigureNumRows, nextFigureNumColumns, CELLTYPE_BACKGROUND);

    this.shardsAnimation.clear();
    this.shardsAnimation = new ShardsAnimation(this.model, this.view, 2);

    this.level = GAME_INITIAL_LEVEL;
    this.updateInterval = this.levelToUpdateInterval(this.level);
    this.currentScore = 0;
    this.totalLines = 0;

    switch (this.gameState) {
      case GAME_STATE_GAMEOVER:
        const gameOverElement =
          document.querySelector('.gameOverPositionContainer');
        gameOverElement.classList.add('make-invisible');
        this.scheduleUpdate();
        break;
      case GAME_STATE_PAUSE:
        this.resumeGame();
        break;
      default:
        this.scheduleUpdate();
        break;
    }
    this.gameState = GAME_STATE_PLAYING;
    this.render();
  }

  togglePause() {
    switch (this.gameState) {
      case GAME_STATE_PLAYING:
        this.pauseGame();
        break;
      case GAME_STATE_PAUSE:
        this.resumeGame();
        break;
    }
  }

  toggleHighscoreDialog(topPos) {
    const dlg = document.querySelector('.highScoreDlgPosition');
    const placeTxt = ['first', 'second', 'third', 'fourth', 'fifth'][topPos];
    dlg.querySelector('.hsdlgTitle').textContent =
      `Congratulation! You took ${placeTxt} place out of the best five!`;
    const darkpanel = document.querySelector('.darkpanel');

    dlg.classList.toggle('make-invisible');
    darkpanel.classList.toggle('make-invisible');

    if (this.gameState === GAME_STATE_HIGHSCORE_DIALOG) {
      this.gameOver(this.gameState);
    } else {
      this.gameState = GAME_STATE_HIGHSCORE_DIALOG;
      document.querySelector('.hsdlgNameInput').focus();
    }
  }

  pauseGame() {
    if (this.gameState != GAME_STATE_PLAYING) return;

    this.gameState = GAME_STATE_PAUSE;

    const posElement = document.querySelector('.pausePositionContainer');

    // TODO: move this style to css
    posElement.style.width = '220px';
    posElement.style.top =
      Math.floor(Settings.VIEW_CELL_HEIGHT * this.model.totalRows * 0.3) + 'px';

    posElement.classList.remove('make-invisible');

    const pauseElement = document.querySelector('.pauseNotificationContainer');
    pauseElement.style.width = '220px';

    const pauseBtn = document.querySelector('#pauseBtn');
    pauseBtn.textContent = 'Unpause';

    clearTimeout(this.updateTimer);
  }

  resumeGame() {
    if (this.gameState !== GAME_STATE_PAUSE) return;

    this.gameState = GAME_STATE_PLAYING;
    const posElement = document.querySelector('.pausePositionContainer');
    posElement.classList.add('make-invisible');

    const pauseBtn = document.querySelector('#pauseBtn');
    pauseBtn.textContent = 'Pause';

    this.scheduleUpdate();
  }

  gameOver(prevState) {
    this.gameState = GAME_STATE_GAMEOVER;
    clearTimeout(this.updateTimer);

    let topPos = null;
    for (let i = 0; i < 5; ++i) {
      if (i in this.highscoreList) {
        if (this.highscoreList[i].score < this.currentScore) {
          topPos = i;
        }
      } else {
        topPos = i;
        break;
      }
    }

    if (prevState === GAME_STATE_PLAYING &&
        this.currentScore && topPos !== null) {
      this.toggleHighscoreDialog(topPos);
      return;
    }


    const gameOverElement =
        document.querySelector('.gameOverPositionContainer');

    gameOverElement.style.top =
      Math.floor(Settings.VIEW_CELL_HEIGHT * this.model.totalRows * 0.3) + 'px';

    gameOverElement.classList.remove('make-invisible');
  }

  scheduleUpdate(timeout) {
    if (this.gameState === GAME_STATE_PAUSE) return;

    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }


    const t = timeout === undefined ? this.updateInterval : +timeout;
    this.updateTimer = setTimeout(this.update.bind(this), t);
  }

  score(filledRows, totalRows, level) {
    let totalScore = 0;

    for (let row of filledRows) {
      const rank = totalRows - row;

      const scoreUpdate = {
        '1': 20,
        '2': 30,
        '3': 40,
        '4': 50,
        '5': 70,
        '6': 90,
        '7': 110,
        '8': 150,
        '9': 200,
        '10': 250,
        '11': 300,
      }[rank] || 500;

      totalScore += scoreUpdate;
    }

    level = level ? level : 1;

    totalScore *= level;

    return totalScore;
  }

  levelToUpdateInterval(level) {
    return {
      '1' : 500,
      '2' : 450,
      '3' : 400,
      '4' : 350,
      '5' : 300,
      '6' : 250,
      '7' : 200,
      '8' : 180,
      '9' : 160,
      '10': 140,
      '11': 120,
      '12': 100,
      '13':  90,
      '14':  80,
    }[level] || 70;
  }

  handleInputKey(code, ctrlKey, altKey, shiftKey) {
    if (code === 'KeyT') {
      // Test some states here
      // this.gameOver();
      // console.log(this.shardsAnimation);

      this.shardsAnimation.clear();
      this.shardsAnimation.addShards([NUM_ROWS - 1]);
      //this.shardsAnimation.spawnShard(200, 200, 'red');
      return;
    }

    if (this.gameState === GAME_STATE_HIGHSCORE_DIALOG) {
      switch (code) {
        case 'Enter': {
          const nameInput = document.querySelector('.hsdlgNameInput');
          if (nameInput === document.activeElement) {
            document.querySelector('.hsdlgSubmitBtn').click()
          }
          break;
        }
        case 'Escape': {
          this.toggleHighscoreDialog();
          break;
        }
      }
      return;
    }

    if (shiftKey && code === 'KeyN') {
      return this.startNewGame();
    }

    switch (this.gameState) {
      case GAME_STATE_PLAYING: {
        if (code === 'KeyP') {
          this.pauseGame();
          return;
        }
        break;
      }
      case GAME_STATE_PAUSE: {
        if (code === 'KeyP' || code === 'Escape') {
          this.resumeGame();
          return;
        }
        break;
      }
      case GAME_STATE_GAMEOVER:
        return;
    }

    if (this.gameState != GAME_STATE_PLAYING) {
      return;
    }

    let dirty = false;
    switch (code) {
      case 'ArrowLeft':
        dirty = this.model.moveLeft();
        break;
      case 'ArrowRight':
        dirty = this.model.moveRight();
        break;
      case 'ArrowUp':
        dirty = this.model.rotateCW();
        break;
      case 'ArrowDown':
        dirty = this.model.rotateCCW();
        break;
      case 'Space':
        dirty = this.model.pushFigureDown();
        if (dirty) {
          this.scheduleUpdate(0);
        }
        break;
    }

    if (dirty) {
      this.render();
    }
  }

  getStartFigure(numColumns) {
    return {
      tetromino: FIGURES.L,
      rotation: ROTATE_CW0,
      row: 0,
      column: numColumns / 2 - 2,
      color: TETROMINO_COLORS[FIGURES.L.index],
    };
  }
}

export {
  Tetris
};
