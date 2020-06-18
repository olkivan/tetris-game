import { deepcopy, createAndFill2DArray } from './Utils.js';

import { TETROMINO_COLORS } from './Colors.js';

import {
  CELLTYPE_BACKGROUND,
  CELLTYPE_TETROMINO,
  CELLTYPE_BAKED_TETROMINO
} from './CellTypes.js';


const ROTATE_CW0 = 0;
const ROTATE_CW90 = 1;
const ROTATE_CW180 = 2;
const ROTATE_CW270 = 3;

class GameFieldModel {
  constructor(allFigures, activeFigure, numRows, numColumns, cellType) {
    this.figures = allFigures;
    this.rows = createAndFill2DArray(numRows, numColumns, {type: cellType});
    this.totalRows = numRows;
    this.totalColumns = numColumns;
    this.activeFigure = deepcopy(activeFigure);

    this.nextFigure = this.generateFigure(1, 1);
  }

  isFigureFits(tetromino, columnOffset, rowOffset, rotation) {
    const figure = tetromino[rotation];
    const gamefield = this.rows;
    const totalRows = this.totalRows;
    const totalColumns = this.totalColumns;

    if (!figure) throw new Error('Undefined figure');

    for (var c = 0; c < 4; ++c) {
      for (var r = 0; r < 4; ++r) {
        const row = rowOffset + r;
        const column = columnOffset + c;

        if (figure[r * 4 + c]) {

          // Check gamefield borders
          if ((row < 0 || column < 0) ||
            (row >= totalRows || column >= totalColumns)) {
            return false;
          }

          // Check if there is a baked tetromino around
          if (gamefield[row][column].type == CELLTYPE_BAKED_TETROMINO) {
            return false;
          }
        }
      }
    }

    return true;
  }


  placeFigure(tetromino, columnOffset, rowOffset, rotation,
              figureColor, cellType) {

    const figure = tetromino[rotation];
    const totalRows = this.totalRows;
    const totalColumns = this.totalColumns;
    const gamefield = this.rows;

    const type = cellType || CELLTYPE_TETROMINO;

    if (!figure) throw new Error('Undefined figure');

    for (var c = 0; c < 4; ++c) {
      for (var r = 0; r < 4; ++r) {
        const row = rowOffset + r;
        const column = columnOffset + c;

        if (row < totalRows && column < totalColumns) {
          const cell = gamefield[row][column];

          if (figure[r * 4 + c]) {
            cell.type = type;
            cell.figureColor = figureColor;
          }
        }
      }
    }
  }

  constructWorld(placeFigure) {
    const numRows = this.totalRows;
    const numColumns = this.totalColumns;
    const gamefield = this.rows;

    // Clean up background
    for (let y = 0; y < numRows; ++y) {
      for (let x = 0; x < numColumns; ++x) {
        if (gamefield[y][x].type != CELLTYPE_BAKED_TETROMINO) {
          // TODO: place a {type: CELLTYPE_BACKGROUND } object instead
          gamefield[y][x].type = CELLTYPE_BACKGROUND;
        }
      }
    }

    if (placeFigure) {
      // Place the tetromino
      const figure = this.activeFigure;

      this.placeFigure(figure.tetromino, figure.column,
                        figure.row, figure.rotation, figure.color);
    }
  }

  generateFigure(row, column) {
    const tetrominoIndex = Math.floor(Math.random() * 7);
    const figureColor = TETROMINO_COLORS[tetrominoIndex];
    const tetromino = this.figures[tetrominoIndex];

    return {
      tetromino: tetromino,
      rotation: ROTATE_CW0,
      row: row,
      column: column,
      color: figureColor
    };
  }

  updateWorld(shardsAnimation) {
    const figure = this.activeFigure;

    // Can we move figure one row below?
    if (this.isFigureFits(figure.tetromino,
      figure.column, figure.row + 1, figure.rotation)) {
      ++figure.row;

      // We can continue
      return { filledRows: [], canProceedFurther: true };
    }

    // No, so bake tetromino (leave it on the gamefield)
    this.placeFigure(
      figure.tetromino,
      figure.column, figure.row,
      figure.rotation, figure.color,
      CELLTYPE_BAKED_TETROMINO);

    // Remove filled rows if any
    const filledRows = this.collectFilledRows();

    shardsAnimation.setShards(filledRows);

    this.removeFilledRows(filledRows);

    // Spawn a new figure
    this.activeFigure = deepcopy(this.nextFigure);
    this.activeFigure.row = 0;
    this.activeFigure.column = this.totalColumns / 2 - 2;

    this.nextFigure = this.generateFigure(1, 1);

    if (!this.isFigureFits(this.activeFigure.tetromino,
      this.activeFigure.column, this.activeFigure.row,
      this.activeFigure.rotation)) {

      // We cannot update anymore
      return { filledRows, canProceedFurther: false };
    }

    return { filledRows, canProceedFurther: true };
  }

  collectFilledRows() {
    let filledRows = [];

    const gamefield = this.rows;
    const numRows = this.totalRows;
    const numColumns = this.totalColumns;

    for (let row = 0; row < numRows; ++row) {
      let filled = true;
      for (let column = 0; column < numColumns; ++column) {
        if (gamefield[row][column].type != CELLTYPE_BAKED_TETROMINO) {
          filled = false;
          break;
        }
      }

      if (filled) {
        filledRows.push(row);
      }
    }
    return filledRows;
  }

  removeFilledRows(rows) {

    if (!rows.length) return;

    const gamefield = this.rows;
    const numRows = this.totalRows;
    const numColumns = this.totalColumns;

    const newGamefield =
      gamefield.filter((_, index) => !rows.includes(index));

    while (newGamefield.length < numRows) {
      let row = [];
      for (let i = 0; i < numColumns; ++i) {
        row.push({ type: CELLTYPE_BACKGROUND });
      }
      newGamefield.unshift(row);
    }

    this.rows = newGamefield;
  }

  moveLeft() {
    const figure = this.activeFigure;

    let isFigureMoved = false;
    if (this.isFigureFits(figure.tetromino,
      figure.column - 1, figure.row, figure.rotation)) {
      --figure.column;
      isFigureMoved = true;
    }

    return isFigureMoved;
  }

  moveRight() {
    const figure = this.activeFigure;

    let isFigureMoved = false;
    if (this.isFigureFits(figure.tetromino,
      figure.column + 1, figure.row, figure.rotation)) {
      ++figure.column;
      isFigureMoved = true;
    }

    return isFigureMoved;
  }

  rotateCW() {
    const figure = this.activeFigure;
    let isFigureRotated = false;

    let newRotate = figure.rotation + 1;
    if (newRotate > ROTATE_CW270) {
      newRotate = ROTATE_CW0;
    }

    if (this.isFigureFits(figure.tetromino,
      figure.column, figure.row, newRotate)) {
      figure.rotation = newRotate;
      isFigureRotated = true;
    }

    return isFigureRotated;
  }

  rotateCCW() {
    const figure = this.activeFigure;
    let isFigureRotated = false;

    let newRotate = figure.rotation - 1;
    if (newRotate < ROTATE_CW0) {
      newRotate = ROTATE_CW270;
    }

    if (this.isFigureFits(figure.tetromino,
      figure.column, figure.row, newRotate)) {
      figure.rotation = newRotate;
      isFigureRotated = true;
    }

    return isFigureRotated;
  }

  pushFigureDown() {
    const figure = this.activeFigure;

    let newRow = figure.row;
    while (this.isFigureFits(figure.tetromino,
      figure.column, newRow + 1, figure.rotation)) {
      ++newRow;
    }

    const isPositionUpdated = figure.row !== newRow;
    figure.row = newRow;

    return isPositionUpdated;
  }

}

export {
  GameFieldModel,
  ROTATE_CW0
};
