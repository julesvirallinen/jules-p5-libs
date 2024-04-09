const X_Y_knobs_on = true;

p5.prototype.setupLibs = function () {
  setupMidi(0, 0);
  rectMode(CENTER);
  colorMode(HSB);
  frameRate(60);
  angleMode(DEGREES);

  background(0);
  setupAudio();
  initPalette(USER_PALETTES, USER_PALETTES.wolo);
};

p5.prototype.setupLibsSimple = function () {
  setupMidi(0, 0);

  setupAudio();
  initPalette(USER_PALETTES, USER_PALETTES.wolo);
};

p5.prototype.updateLibs = function (shouldClear = true, config) {
  updateAudio();
  try {
    setConfig();
  } catch (error) {
    print("setConfig not defined!");
  }

  if (frameCount % 400 === 0) {
    persistMidiValues();
  }

  let x = getMidi(10, width, width / 2) - width / 2;
  let y = getMidi(11, height, height / 2) - height / 2;
  let scale_amount = getMidi(12, 1, 0.5) + 0.5;
  scale(scale_amount);
  X_Y_knobs_on && translate(x, y, 0);
  shouldClear && background(0, C.bgTrans);
  //shouldClear && background(0, 255, 0, C.bgTrans * 10);
};

USER_PALETTES = {
  mono: ["#D9D7D8", "#3B5159", "#5D848C", "#7CA2A6", "#262321"],
  riverside: ["#906FA6", "#025951", "#252625", "#D99191"],
  mao: ["#9F3C31", "#5F614D", "#727456", "#D6C8A1", "#A4322D"],
  sunrise: ["#F9ED69", "#F08A5D", "#B83B5E", "#6A2C70"],
  wolo: ["#08D9D6", "#252A34", "#FF2E63", "#EAEAEA"],
  techno: ["#4B4745", "#7B7E7F", "#A6B4BD", "#D0E8FC"],
  matrix: ["#02734A", "#02734A", "#238387"],
  nightsky: ["#252A34", "#F2AE2E", "#D9D16A", "#D49B54"],
  lollipop: ["#F7A4A4", "#FEBE8C", "#FFFBC1", "#B6E2A1"],
  killbill: ["#fcd612", "	#f9c31a", "	#f8b71d", "#d61a1f"],
  vampire: ["#DF221F", "#EF2C34", "#F94448", "#393536"],
  decant: ["#b80c09ff", "#2a3d45ff", "#eca72cff", "#a0ddffff", "#c3dac3ff"],
  wine: ["#9B0000", "#6D0000", "#580000", "#430000"],
  white: ["#fff"],
  black: ["#000"],
  walli1: ["#ff0035", "#222a68", "#654597", "#1b998b", "#393a10"],
  purple: ["#46244C", "#712B75", "#C74B50", "#D49B54"],
  blue: ["#162447", "#1F4068", "#1B1B2F", "#E43F5A"],
  space: ["#16213E", "#0F3460", "#533483", "#E94560"],
  night: ["#404258", "#474E68", "#50577A", "#6B728E"],
  blood: ["#54123B", "#84142D", "#C02739", "#29C7AC"],
  gpt: ["#46244C", "#712B75", "#C74B50", "#D49B54"],
  neon: ["#00FF00", "#FF00FF", "#00FFFF", "#FFA500"],
  earthy: ["#698269", "#B99B6B", "#F1DBBF", "#AA5656"],
  crimson: ["#FF0000", "#FFFFFF", "#771140", "#FFA07A"],
  asdf: ["#aa1155", "#880044", "#dd1155", "#ffee88", "#00cc99"],
  kobe1: ["#1B3148", "#C03952", "#2C2F33", "#F7DCB4"],
  kobe2: ["#0300AD", "#E74C3C", "#242528", "#E5E5E5"],
  kobe3: ["#34495E", "#FF6659", "#1F1F1F", "#B9A39B"],
  winter: ["#B2EBF2", "#F8F9FA", "#757575", "#800020", "#228B22"],
  winter1: ["#5C3E5A", "#C27F84", "#F2B19A", "#F2E7D9"],
  winter2: ["#2C3E50", "#E67E22", "#F1C40F", "#ECF0F1"],
  winter1_blue: ["#4C3E6A", "#B27C8A", "#E7B4A4", "#E1E7F1"],
  winter2_blue: ["#2C3E60", "#D6772C", "#E8C21A", "#E6EEF0"],
  bigbass: ["#FFC17F", "#FF714A", "#D35400", "#FFD700", "#228B22"],
  volpe_chill: ["#D0E1F9", "#98D2C1", "#7868E6", "#E40066", "#414770"],
  volpe_rise: ["#546D64", "#815589", "#E80C70", "#1E3A8A", "#2C2F33"],
  volpe_heavy: ["#19323C", "#4B0082", "#8B0000", "#000080", "#2C2F33"],
  winter1_darker_blue: ["#3C2E5A", "#9B6C7A", "#D39F94", "#C1D2E2"],
  snowflake: ["#3A4B6B", "#5A6C8A", "#7C8DAA", "#E8A564", "#E1E7F1"],
  pipe_screensaver: ["#FF9D41", "#FF0000", "#00ED00", "#849E00"],
  winter2_darker_blue: ["#1C2E50", "#C5662C", "#D5AF1A", "#DCE5F0"],
  tropical: ["#3E7E28", "#E5E263", "#66B2FF", "#FFA500", "#FF6B6B"],
  tekstitv: ["#FF0000", "#00FF00", "#0000FF", "#00FFFF", "#FFFF00"],
  idaradio: ["#FFB1A8", "#1BB287", "#7662E5", "#E3E3E3"],

  lush: ["#4CAF50", "#8BC34A", "#2E7D32", "#388E3C", "#00C853"],

  minta1: ["#A463F2", "#4BCA81", "#FF79A7", "#D5DBE2", "#6D6D6D"],
  minta2: ["#8854D0", "#2E856E", "#EE4266", "#C2C2C2", "#464646"],
  minta3: ["#7158E2", "#2BCA83", "#FF4D8E", "#B8B8B8", "#343434"],
  purpleblue: [
    ...arrayToN(255).map((n) => ({ mode: "rgb", values: [n, 0, 100] })),
    ...arrayToN(255).map((n) => ({ mode: "rgb", values: [255 - n, 0, 100] })),
  ],
  yellowGreen: [
    ...arrayToN(100).map((n) => ({ mode: "hsb", values: [n + 50, 255, 159] })),
  ],

  pinkpurple: [
    ...arrayToN(255).map((n) => ({ mode: "rgb", values: [255, 0, n] })),
    ...arrayToN(255).map((n) => ({ mode: "rgb", values: [255 - n, 0, 255] })),
  ],
  bluered: [
    ...arrayToN(255).map((n) => ({ mode: "rgb", values: [0, 0, n] })),
    ...arrayToN(255).map((n) => ({ mode: "rgb", values: [n, 0, 255 - n] })),
  ],
  pinkpurple: [
    ...arrayToN(255).map((n) => ({ mode: "rgb", values: [255, 0, n] })),
    ...arrayToN(255).map((n) => ({ mode: "rgb", values: [255 - n, 0, 255] })),
  ],
};
