let createArrayOfSize = (n) => [...Array(n).keys()];

const DEFAULT_PRESETS = {
  benedictus: ["#F27EA9", "#366CD9", "#5EADF2", "#636E73", "#F2E6D8"],
  cross: ["#D962AF", "#58A6A6", "#8AA66F", "#F29F05", "#F26D6D"],
  demuth: ["#222940", "#D98E04", "#F2A950", "#BF3E21"],
  hiroshige: ["#1B618C", "#55CCD9", "#F2BC57", "#F2DAAC", "#F24949"],
  hokusai: ["#074A59", "#F2C166", "#F28241", "#F26B5E"],
  hokusaiblue: ["#023059", "#459DBF", "#87BF60", "#D9D16A"],
  java: ["#632973", "#02734A", "#F25C05", "#F29188", "#F2E0DF"],
  kandinski: ["#8D95A6", "#0A7360", "#F28705", "#D98825"],
  monet: ["#4146A6", "#063573", "#5EC8F2", "#8C4E03", "#D98A29"],
  nizami: ["#034AA6", "#72B6F2", "#73BFB1", "#F2A30F", "#F26F63"],
  renoir: ["#303E8C", "#F2AE2E", "#F28705", "#D91414"],
  mondrian: ["#E70503", "#0300AD", "#FDDE06", "#EAEFE9"],
  vangogh: ["#424D8C", "#84A9BF", "#C1D9CE", "#F2B705", "#F25C05"],

  rainbow: [
    ...createArrayOfSize(360).map((n) => ({
      mode: "hsb",
      values: [n, 255, 255],
    })),
    ...createArrayOfSize(360).map((n) => ({
      mode: "hsb",
      values: [360 - n, 255, 255],
    })),
  ],
};

let PALETTES = {
  ...DEFAULT_PRESETS,
};

let globalTransparency = 1;
let colors = [];

let defPreset = PALETTES.nizami;

let selectedColorPalette;
let currentlySelectedColorPaletteName;
let BG_COLOR = [10];

const getColor = (col, T = 1) => {
  if (typeof col === "object" && col !== null) {
    let mode = col.mode || "hsb";
    if (mode === "rgb") {
      colorMode("rgb", 255, 255, 255, 1);
      const [R, G, B] = col.values;
      return color(R, G, B, T);
    }
    if (mode === "hsb") {
      colorMode("hsb");
      const [H, S, B] = col.values;
      if (!B) return color(H, S);
      if (!S) return color(H);
      return color(H, S, B);
    }
  }
  if (Array.isArray(col)) {
    const [H, S, B] = col;
    if (!B) return color(H, S);
    if (!S) return color(H);
    return color(H, S, B);
  }

  if (typeof col === "string" || col instanceof String) {
    return color(col);
  }
};

const getColAtI = (i, t) => {
  const c = getI(colors, i);
  c && c.setAlpha(t);
  return c;
};

const setSelected = (paletteArr) => {
  selectedColorPalette = paletteArr;
  colors = selectedColorPalette.map((col) => getColor(col, globalTransparency));
  return P;
};

const setPalette = (name) => {
  if (currentlySelectedColorPaletteName === name) {
    return P;
  }
  if (Object.hasOwnProperty.call(PALETTES, name)) {
    currentlySelectedColorPaletteName = name;
    return setSelected(PALETTES[name]);
  }
  return setSelected(defPreset);
};

/**
 * All palette functions, generally chainable
 * P.setTrans(0.5).getI(0) etc
 */
let P = {
  /** Get current color palette as array */
  colors: () => colors,
  /** Get color at index, this is what I mostly use */
  getI: (i, opacity = globalTransparency) => getColAtI(i, opacity),
  /** Set palette */
  setPreset: (name) => setPalette(name),
  /** Set palette */
  setPalette: (name) => setPalette(name),
  /** Set to array of colors in sketch */
  set: (palette) => setSelected(palette),
  /** Shift all colors in palette */
  shift: () => setSelected(shiftArray(selectedColorPalette)),
  /** Set global transparency of palette */
  setTrans: (trans) => {
    globalTransparency = trans;
    return P;
  },
  getBG: () => getColor(BG_COLOR),
  getRandom: (opacity = 1) =>
    getColAtI(randomInt(colors.length - 1, 0), opacity),
};

p5.prototype.initPalette = function (userPalettes, defaultPalette) {
  PALETTES = { ...PALETTES, ...userPalettes };
  defPreset = defaultPalette || defPreset;
  globalTransparency = 1;
  setPalette(selectedColorPalette || defPreset);
};
