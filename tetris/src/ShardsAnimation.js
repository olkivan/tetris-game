import {
  CELLTYPE_BACKGROUND,
  CELLTYPE_TETROMINO,
  CELLTYPE_BAKED_TETROMINO
} from './CellTypes.js';


class ShardsAnimation {
  constructor(model, view, granularity) {
    // TODO: improve performance or remove granularity arg
    this.granularity = 1;
    this.model = model;
    this.view = view;
    this.shardContainer = document.createElement('div');

    document.querySelector(this.view.containerName)
                            .appendChild(this.shardContainer)

    this.shards = [];
    this.time = 0;
  }

  clear() {
    document.querySelector(this.view.containerName)
      .removeChild(this.shardContainer);

    this.shardContainer = document.createElement('div');

    document.querySelector(this.view.containerName)
      .appendChild(this.shardContainer)

    this.shards = [];
    this.time = 0;
  }

  setShards(filledRows) {
    if (!filledRows.length)  return;

    this.clear();

    for (const row of filledRows) {
      for (const [column, cell] of this.model.rows[row].entries()) {
        if (cell.type !== CELLTYPE_BAKED_TETROMINO) {
          console.log('Invalid cell type');
          continue;
        }

        const x = column * this.view.cellWidth;
        const y = row * this.view.cellHeight;
        this.spawnShard(x, y, cell.figureColor);
      }
    }

    this.time = Date.now();
    requestAnimationFrame(this.tick.bind(this))
  }

  tick() {
    this.shards = this.shards.filter(shard => {
      return shard.y < this.view.numRows * this.view.cellHeight;
    });

    if (this.shards.length) {
      this.update((Date.now() - this.time) / 30);
      requestAnimationFrame(this.tick.bind(this))
    }
  }

  update(dt) {

    const gravity = 1;

    for (const shard of this.shards) {
      shard.x = shard.originx + shard.velocity * dt * Math.cos(shard.angle);
      shard.y = shard.originy - shard.velocity * dt * Math.sin(shard.angle)
                        + gravity * dt * dt;

      shard.element.style.transform = `translate(${shard.x}px, ${shard.y}px)`;
    }
  }

  spawnShard(x, y, color) {
    const shardWidth = this.view.cellWidth / this.granularity;
    const shardHeight = this.view.cellHeight / this.granularity;


    for (let shardRow = 0; shardRow < this.granularity; ++shardRow) {
      for (let shardCol = 0; shardCol < this.granularity; ++shardCol ) {
        const shardx = x + shardCol * shardWidth;
        const shardy = y + shardRow * shardHeight;

        const shard = document.createElement('div');

        shard.className = 'shard';
        shard.style.width = shardWidth;
        shard.style.height = shardHeight;
        shard.style.transform = `translate(${shardx}px, ${shardy}px)`;
        shard.style.backgroundColor = color;

        this.shards.push( {
          originx: shardx,
          originy: shardy,
          x: shardx,
          y: shardy,
          velocity: 15 + Math.random() * 10,
          angle: (Math.random() * Math.PI) / 4. + Math.PI / 2 - Math.PI / 8,
          element: shard
        } );
        this.shardContainer.appendChild(shard);
      }
    }
  }
}


export {
  ShardsAnimation
};
