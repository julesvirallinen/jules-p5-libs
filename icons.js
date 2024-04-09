let ICONDEFS = [
  {
    name: "headcogs",
    path: "data/i/headcogs.png",
    category: "heads",
  },
  {
    name: "banana",
    path: "data/i/banana_art.png",
    category: "weird",
  },
  {
    name: "boobface",
    path: "data/i/boobface.png",
    category: "boobface",
  },
  {
    name: "cat",
    path: "data/i/cat.png",
    category: "animals",
  },
  {
    name: "dvd",
    path: "data/i/dvd.png",
    category: "random",
  },
  {
    name: "dogo",
    path: "data/i/mintadogo.png",
    category: "animals",
  },
  {
    name: "alpaca",
    path: "data/i/alpaca.png",
    category: "animals",
  },
  {
    name: "addict",
    path: "data/i/addict.png",
    category: "heads",
  },
  {
    name: "needs",
    path: "data/i/needs.png",
    category: "heads",
  },
  {
    name: "panic",
    path: "data/i/panic.png",
    category: "heads",
  },
  {
    name: "anxiety",
    path: "data/i/anxiety.png",
    category: "heads",
  },
  {
    name: "snowflake",
    path: "data/i/snowflake.png",
    category: "winter",
  },
  {
    name: "girl",
    path: "data/i/girl.png",
    category: "weird",
  },
  {
    name: "money",
    path: "data/i/money.png",
    category: "business",
  },
  {
    name: "tracking",
    path: "data/i/tracking.png",
    category: "business",
  },
  {
    name: "aim",
    path: "data/i/aim.png",
    category: "business",
  },
  {
    name: "rockhead",
    path: "data/i/boobface-rock-on.png",
    category: "boobface",
  },
  {
    name: "butthead",
    path: "data/i/butthead.png",
    category: "boobface",
  },
  {
    name: "fisthead",
    path: "data/i/fisthead.png",
    category: "boobface",
  },
  {
    name: "lickhead",
    path: "data/i/lickhead.png",
    category: "boobface",
  },
  {
    name: "fingerhead",
    path: "data/i/fingerhead.png",
    category: "boobface",
  },
  {
    name: "mirror",
    path: "data/i/mirror.png",
    category: "witch",
  },
  {
    name: "pug",
    path: "data/i/pug.png",
    category: "animals",
  },
  {
    name: "snowflake2",
    path: "data/i/snowflake2.png",
    category: "winter",
  },
  {
    name: "cone",
    path: "data/i/cone.png",
    category: "cool",
  },
  {
    name: "mushroom",
    path: "data/i/mushroom.png",
    category: "cool",
  },
  {
    name: "smoking",
    path: "data/i/smoking.png",
    category: "cool",
  },
  {
    name: "smallhand",
    path: "data/i/smallhand.png",
    category: "hands",
  },
  {
    name: "illuminati",
    path: "data/i/illuminati.png",
    category: "cool",
  },
  {
    name: "bird-skull",
    path: "data/i/bird-skull.png",
    category: "witch",
  },
  {
    name: "titta",
    path: "data/i/titta_2.png",
    category: "titta",
  },
  {
    name: "titta2",
    path: "data/i/titta_1.png",
    category: "titta",
  },
  {
    name: "void",
    path: "data/i/void.png",
    category: "business",
  },
  {
    name: "decant",
    path: "data/i/decant.png",
    category: "wine",
  },
  {
    name: "wine",
    path: "data/i/wine.png",
    category: "wine",
  },
  {
    name: "dance",
    path: "data/i/dance.png",
    category: "cool",
  },
  {
    name: "acid",
    path: "data/i/acid.png",
    category: "cool",
  },
  {
    name: "catpills",
    path: "data/i/catpills.png",
    category: "animals",
  },
  {
    name: "huulet",
    path: "data/i/huulet.png",
    category: "oneoff",
  },
  {
    name: "joel",
    path: "data/i/joel.png",
    category: "oneoff",
  },
  {
    name: "flame",
    path: "data/i/flame.png",
    category: "emoji",
  },
  {
    name: "satan",
    path: "data/i/satan.png",
    category: "oneoff",
  },
  {
    name: "moon",
    path: "data/i/moon.png",
    category: "emoji",
  },
  {
    name: "smirk",
    path: "data/i/smirk.png",
    category: "horny",
  },
  {
    name: "twerk",
    path: "data/i/twerk.png",
    category: "horny",
  },
  {
    name: "twerk2",
    path: "data/i/twerk2.png",
    category: "horny",
  },
  {
    name: "sperm",
    path: "data/i/sperm.png",
    category: "horny",
  },
  {
    name: "plug",
    path: "data/i/plug.png",
    category: "horny",
  },
  {
    name: "benis",
    path: "data/i/benis.png",
    category: "horny",
  },
  {
    name: "butt",
    path: "data/i/butt.png",
    category: "horny",
  },
  {
    name: "pill",
    path: "data/i/pill.png",
    category: "drugs",
  },
  {
    name: "weed",
    path: "data/i/weed.png",
    category: "drugs",
  },
  {
    name: "gucci",
    path: "data/i/gucci.png",
    category: "horny",
  },
  {
    name: "mörkö",
    path: "data/i/mörkö2.png",
    category: "oneoff",
  },
  {
    name: "F",
    path: "data/i/F.png",
    category: "fotograf",
  },
  {
    name: "M",
    path: "data/i/M.png",
    category: "fotograf",
  },
];

LOADED_ICON_DATA = [];
loadedIcons = [];
let ICON_LOADING_COUNT = 0;

const addIcon = (icon, data, color) => {
  LOADED_ICON_DATA = [
    ...LOADED_ICON_DATA,
    { ...data, icon, color: JSON.stringify(color) },
  ];
  loadedIcons = LOADED_ICON_DATA.map((i) => i.icon);
};

const loadIcon = (name, color, color2) => {
  let icondef = ICONDEFS.find((i) => i.name === name);
  if (!icondef && !LOADED_ICON_DATA[0]) {
    icondef = ICONDEFS[0];
  }
  return loadImage(icondef.path, (image) => {
    image.resize(500, 500);
    g = createGraphics(image.width, image.height);
    // g.colorMode(HSB);
    if (color2) {
      g.tint(255);
      g.image(image, 0, 0);
      g.tint(color);
      g.image(image, 0, 0, image.width - 30, image.height - 30);
    } else {
      g.tint(color);
      g.image(image, 0, 0, image.width, image.height);
    }
    addIcon(g, icondef, color);
    ICON_LOADING_COUNT = 0;
  });
};

const drawIcon = (name, color, x, y, width, height, folder) => {
  let iconName;
  print(folder);
  if (name) {
    found_icons = ICONDEFS.filter((icon) => icon.category == folder) ?? [];
    iconName = R.prop("name", takeRandom(found_icons));
  }
  iconName = iconName ?? name;
  icon = LOADED_ICON_DATA.find(
    (i) => i.name === iconName && i.color === JSON.stringify(color)
  );
  if (!icon) {
    backupIcon = LOADED_ICON_DATA.find((i) => i.name === iconName);
    if (backupIcon) {
      image(backupIcon.icon, x, y, width, height);
    }
    ICON_LOADING_COUNT++;
    if (ICON_LOADING_COUNT > 3) {
      return;
    }
    return loadIcon(name, color);
  }
  image(icon.icon, x, y, width, height);
};
