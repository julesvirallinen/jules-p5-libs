p5.prototype.setToLocalStorage = (key, value) => {
  //  console.log(`setting to localstorage ${key} ${value}`)
  localStorage.setItem(key, value);
};

p5.prototype.getFromLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  // console.log(`getting from localstorage ${key} ${value}`)
  return value;
};

// BAD CODE!!! what does it mean??+
p5.prototype.getOrPersistFromLocalStorage = (key, value) => {
  if (R.isNil(value)) {
    const newValue = getFromLocalStorage(key);
    return newValue;
  } else {
    setToLocalStorage(key, value);
    return value;
  }
};

let getFromLocalStorageOrDefaultTo = (key, defaultTo) => {
  value = localStorage.getItem(key);
  if (value === null || value === undefined) {
    setToLocalStorage(key, defaultTo);
    return defaultTo;
  }
  return value;
};

const locEq = (loc1, loc2) => loc1.x == loc2.x && loc1.y == loc2.y;

// ramda

let arrayToN = (n) => [...Array(n).keys()];

let shiftArray = (array, n) => {
  let newArray = array.slice();
  for (let i = 0; i < n; i++) {
    newArray.unshift(newArray.pop());
  }
  return newArray;
};

let getI = (array, i) => array[Number.parseInt(abs(i)) % array?.length || 0];
const getFFT = (n) => fft[n % fft.length];

const randomInt = (max, min = 0) => Math.floor(random() * (max - min) + min);

let takeRandom = (array) => array[randomInt(array.length)];

function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

// factories

const coordinateMover = ({
  x = 0,
  y = 0,
  direction = random(360),
  speed = 1,
  xMax = width,
  yMax = height,
  ...rest
}) => ({
  pos: createVector(x, y),
  vel: p5.Vector.fromAngle(radians(direction)).mult(speed),
  acc: createVector(0, 0),
  radius: 10,
  elasticity: 1,
  mass: 1,
  direction: direction,
  xMax,
  yMax,
  ...rest,
  applyForce(force) {
    this.acc.add(force);
  },
  setDirection(direction) {
    this.vel = p5.Vector.fromAngle(radians(direction));
  },
  update(speed, direction) {
    this.direction = degrees(this.vel.heading());

    if (speed) {
      this.vel.setMag(speed);
    } else {
      return;
    }
    this.pos.add(this.vel);
  },
  checkEdges(elasticity) {
    if (this.pos.y > this.yMax - this.radius) {
      this.vel.y *= -this.elasticity;
      this.pos.y = this.yMax - this.radius;
      return true;
    }
    if (this.pos.y < 0 + this.radius / 2) {
      this.vel.y *= -this.elasticity;
      this.pos.y = 0 + this.radius / 2 + 1;
      return true;
    }

    if (this.pos.x > this.xMax - this.radius) {
      this.vel.x *= -this.elasticity;
      this.pos.x = this.xMax - this.radius;
      return true;
    }
    if (this.pos.x < 0 + this.radius / 2) {
      this.vel.x *= -this.elasticity;
      this.pos.x = 0 + this.radius / 2 + 1;
      return true;
    }
  },
  isOver() {
    // Check if the object is off the edge of the canvas
    if (this.pos.x > this.xMax + this.radius) {
      return true;
    } else if (this.pos.x < -this.radius) {
      return true;
    }
    if (this.pos.y > this.yMax + this.radius) {
      return true;
    } else if (this.pos.y < -this.radius) {
      return true;
    } else {
      return false;
    }
  },
  otherSide() {
    // Check if the object is off the edge of the canvas
    if (this.pos.x > width + this.radius) {
      this.pos.x = -this.radius;
    } else if (this.pos.x < -this.radius) {
      this.pos.x = width + this.radius;
    }
    if (this.pos.y > height + this.radius) {
      this.pos.y = -this.radius;
    } else if (this.pos.y < -this.radius) {
      this.pos.y = height + this.radius;
    } else {
      return;
    }
  },
});

const arrayManager = (max = 0, addFn) => ({
  things: [],
  update(count = 0, addFn) {
    this.count = floor(count);

    let nToAdd = Math.max(0, this.count - this.things.length);
    this.add(nToAdd, addFn);
    this.removeExtra(count);
  },
  removeExtra(max) {
    let nToRemove = Math.max(0, this.things?.length - max);
    this.remove(nToRemove);
  },
  run(fn) {
    this.things.forEach(fn);
  },
  filter(fn) {
    this.things.filter(fn);
  },
  add(n, addFn) {
    for (let i = 0; i < n; i++) {
      this.things.push(addFn(i));
    }
  },
  remove(n) {
    this.things = R.drop(n, this.things);
  },
});

const drawGrid =
  ({ height, width, gap }) =>
  (fn) => {
    height = height ?? width;
    xCount = windowWidth / (width + gap);
    yCount = windowHeight / (height + gap);
    for (var x = 0; x < xCount - 0; x++) {
      for (var y = 0; y < yCount - 0; y++) {
        loc = createVector(x * (width + gap), y * (height + gap));
        push();
        translate(loc.x, loc.y);
        fn({ x, y });
        pop();
      }
    }
  };

function polygon(x, y, sides, size) {
  beginShape();
  angleMode(RADIANS);
  for (let i = 0; i < sides; i++) {
    let angle = map(i, 0, sides, 0, TWO_PI);
    let vertexX = x + cos(angle) * size;
    let vertexY = y + sin(angle) * size;
    vertex(vertexX, vertexY);
  }
  angleMode(DEGREES);
  endShape(CLOSE);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
