import { RGB } from './Utils.js';

import {
  CELLTYPE_BACKGROUND,
  CELLTYPE_TETROMINO,
  CELLTYPE_BAKED_TETROMINO
} from './CellTypes.js';

class GameFieldView {
  constructor(containerName, numRows, numColumns, cellWidth, cellHeight) {
    const gameField = document.querySelector(containerName);
    gameField.style.width = numColumns * cellWidth;
    gameField.style.height = numRows * cellHeight;

    const totalCells = numRows * numColumns;

    const cells = [];
    for (let i = 0; i < totalCells; ++i) {
      const cell = document.createElement('div');
      cell.className = 'bgCell';
      cell.style.width = cellWidth;
      cell.style.height = cellHeight;

      cells.push(cell);
      gameField.appendChild(cell);
    }

    this.cells = cells;
    this.numRows = numRows;
    this.numColumns = numColumns;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.containerName = containerName;

    this.bgCellColors = [
      RGB(45, 30, 45),
      RGB(0, 0, 0),
      RGB(45, 30, 45)
    ];
  }

  render(model) {
    if (model.totalColumns != this.numColumns ||
        model.totalRows != this.numRows) {
      throw new Error('Invalid model', model.totalColumns, model.totalRows,
        this.totalColumns, this.totalRows);
    }

    for (let row = 0; row < model.totalRows; ++row) {
      for (let column = 0; column < model.totalColumns; ++column) {
        let cellColor = null;
        let borderStyle = '0px'; // TODO: remove border style logic
        const cell = model.rows[row][column];

        switch (cell.type) {
          case CELLTYPE_BACKGROUND:
            cellColor = this.bgCellColors[column % 2 + row % 2];
            break;
          case CELLTYPE_TETROMINO:
            cellColor = cell.figureColor;
            break;
          case CELLTYPE_BAKED_TETROMINO:
            cellColor = cell.figureColor;
            borderStyle = '2px dotted red'; // TODO: remove border style logic
            break;
          default:
            cellColor = cell.figureColor;
        }

        const viewCell = this.cells[row * model.totalColumns + column];
        if (cellColor != viewCell.style.backgroundColor) {
          viewCell.style.backgroundColor = cellColor;
        }

        if (borderStyle != viewCell.style.border) {
          viewCell.style.border = borderStyle;
        }
      }
    }
  }
}


export {
  GameFieldView
};
