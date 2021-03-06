function getTetrominos() {
  const z_tetromino = [
    [
      0, 0, 1, 0,
      0, 1, 1, 0,
      0, 1, 0, 0,
      0, 0, 0, 0
    ],
    [
      0, 0, 0, 0,
      1, 1, 0, 0,
      0, 1, 1, 0,
      0, 0, 0, 0
    ],
    [
      0, 0, 0, 0,
      0, 0, 1, 0,
      0, 1, 1, 0,
      0, 1, 0, 0
    ],
    [
      0, 0, 0, 0,
      0, 1, 1, 0,
      0, 0, 1, 1,
      0, 0, 0, 0
    ]
  ];
  z_tetromino.index = 0;

  const s_tetromino = [
    [
      0, 1, 0, 0,
      0, 1, 1, 0,
      0, 0, 1, 0,
      0, 0, 0, 0
    ],
    [
      0, 0, 0, 0,
      0, 1, 1, 0,
      1, 1, 0, 0,
      0, 0, 0, 0
    ],
    [
      0, 0, 0, 0,
      0, 1, 0, 0,
      0, 1, 1, 0,
      0, 0, 1, 0
    ],
    [
      0, 0, 0, 0,
      0, 0, 1, 1,
      0, 1, 1, 0,
      0, 0, 0, 0
    ]
  ];
  s_tetromino.index = 1;

  const t_tetromino = [
    [
      0, 1, 0, 0,
      0, 1, 1, 0,
      0, 1, 0, 0,
      0, 0, 0, 0
    ],
    [
      0, 1, 0, 0,
      1, 1, 1, 0,
      0, 0, 0, 0,
      0, 0, 0, 0
    ],
    [
      0, 1, 0, 0,
      1, 1, 0, 0,
      0, 1, 0, 0,
      0, 0, 0, 0
    ],
    [
      0, 0, 0, 0,
      1, 1, 1, 0,
      0, 1, 0, 0,
      0, 0, 0, 0
    ]
  ];
  t_tetromino.index = 2;

  const l_tetromino = [
    [
      0, 1, 0, 0,
      0, 1, 0, 0,
      0, 1, 1, 0,
      0, 0, 0, 0
    ],
    [
      0, 0, 0, 0,
      0, 0, 1, 0,
      1, 1, 1, 0,
      0, 0, 0, 0
    ],
    [
      0, 0, 0, 0,
      0, 1, 1, 0,
      0, 0, 1, 0,
      0, 0, 1, 0
    ],
    [
      0, 0, 0, 0,
      0, 1, 1, 1,
      0, 1, 0, 0,
      0, 0, 0, 0
    ]
  ];
  l_tetromino.index = 3;


  const j_tetromino = [
    [
      0, 0, 1, 0,
      0, 0, 1, 0,
      0, 1, 1, 0,
      0, 0, 0, 0
    ],
    [
      0, 0, 0, 0,
      1, 1, 1, 0,
      0, 0, 1, 0,
      0, 0, 0, 0
    ],
    [
      0, 0, 0, 0,
      0, 1, 1, 0,
      0, 1, 0, 0,
      0, 1, 0, 0
    ],
    [
      0, 0, 0, 0,
      0, 1, 0, 0,
      0, 1, 1, 1,
      0, 0, 0, 0
    ]
  ];
  j_tetromino.index = 4;

  const i_tetromino = [
    [
      0, 1, 0, 0,
      0, 1, 0, 0,
      0, 1, 0, 0,
      0, 1, 0, 0
    ],
    [
      0, 0, 0, 0,
      0, 0, 0, 0,
      1, 1, 1, 1,
      0, 0, 0, 0
    ],
    [
      0, 0, 1, 0,
      0, 0, 1, 0,
      0, 0, 1, 0,
      0, 0, 1, 0
    ],
    [
      0, 0, 0, 0,
      1, 1, 1, 1,
      0, 0, 0, 0,
      0, 0, 0, 0
    ]
  ];
  i_tetromino.index = 5;

  const o_tetromino = [
    [
      0, 0, 0, 0,
      0, 1, 1, 0,
      0, 1, 1, 0,
      0, 0, 0, 0
    ],
    [
      0, 0, 0, 0,
      0, 1, 1, 0,
      0, 1, 1, 0,
      0, 0, 0, 0
    ],
    [
      0, 0, 0, 0,
      0, 1, 1, 0,
      0, 1, 1, 0,
      0, 0, 0, 0
    ],
    [
      0, 0, 0, 0,
      0, 1, 1, 0,
      0, 1, 1, 0,
      0, 0, 0, 0
    ]
  ];
  o_tetromino.index = 6;

  return {
    0: z_tetromino,
    1: s_tetromino,
    2: t_tetromino,
    3: l_tetromino,
    4: j_tetromino,
    5: i_tetromino,
    6: o_tetromino,
    Z: z_tetromino,
    S: s_tetromino,
    T: t_tetromino,
    L: l_tetromino,
    J: j_tetromino,
    I: i_tetromino,
    O: o_tetromino,
    length: 6,
  };
}


export {
  getTetrominos
};
