let state = [];
let nextState = [];
let ymax;
let xmax;

const setValue = (board) => (x, y, field, value) => {
  if (!board[x]) board[x] = [];
  if (!board[x][y]) board[x][y] = {};
  board[x][y][field] = value;
};

const setState = (x, y, field, value) => setValue(state)(x, y, field, value);

const getState = (x, y) => {
  return R.path([x, y], state);
};

const getNextState = (x, y) => {
  return R.path([x, y], nextState);
};

const getStateValue = (x, y, field) => {
  return R.path([x, y, field], state);
};

const wrapCoord = (val, maxVal) => {
  if (val < 0) return maxVal - 1;
  if (val >= maxVal) return 0;
  return val;
};

const getStateWrapped = (x, y) => {
  return getState(wrapCoord(x, xmax), wrapCoord(y, ymax));
};

const getNeighbors = (x, y) => [
  getStateWrapped(x - 1, y - 1),
  getStateWrapped(x + 1, y + 1),
  getStateWrapped(x, y - 1),
  getStateWrapped(x, y + 1),
  getStateWrapped(x + 1, y - 1),
  getStateWrapped(x - 1, y + 1),
  getStateWrapped(x - 1, y),
  getStateWrapped(x + 1, y),
];

const gridHelper = ({ width, height, gap }) => ({
  gameLoop: (fn) => {
    xmax = ceil(windowWidth / (width + gap));
    ymax = ceil(windowHeight / (height + gap));
    for (var x = 0; x < xmax - 0; x++) {
      for (var y = 0; y < ymax - 0; y++) {
        fn({
          x,
          y,
          curState: getState(x, y),
          neighbors: getNeighbors(x, y),
          nextState: getNextState(x, y),
          set: (field, value) => setState(x, y, field, value),
          setNext: (field, value) => setValue(nextState)(x, y, field, value),
        });
      }
    }
  },
  drawLoop: (fn) => {
    xmax = ceil(windowWidth / (width + gap));
    ymax = ceil(windowHeight / (height + gap));
    for (var x = 0; x < xmax - 0; x++) {
      for (var y = 0; y < ymax - 0; y++) {
        loc = createVector(x * (width + gap), y * (height + gap));
        push();
        translate(loc.x, loc.y);
        fn({
          x,
          y,
          curState: getState(x, y),
          neighbors: getNeighbors(x, y),
          loc,
          set: (field, value) => setState(x, y, field, value),
        });
        pop();
      }
    }
  },
  applyNext: () => {
    state = nextState;
    nextState = [];
  },
});

const grid =
  ({ height, width, gap }) =>
  (fn) => {
    height = height ?? width;
    xmax = windowWidth / (width + gap);
    ymax = windowHeight / (height + gap);
    for (var x = 0; x < xmax - 0; x++) {
      for (var y = 0; y < ymax - 0; y++) {
        loc = createVector(x * (width + gap), y * (height + gap));
        push();
        translate(loc.x, loc.y);
        fn({
          x,
          y,
          curState: getState(x, y),
          loc,
          set: (field, value) => setState(x, y, field, value),
          xmax,
          ymax,
        });
        pop();
      }
    }
  };
