CLOCK = -1;
CBEAT = 0;
CBAR = 0;
BEAT_PROGRESS = 0;
BPROG = 0;
const FMIDI = { BEAT: 0, BAR: 0, CLOCK: -1 };
let midimessages = [];
let onCBeat = false;

let onCBar = false;
let onCHalfBeat = false;

// Left: slot the value is saved in, right, ccValue of the device
// getMidiValue(10, 100, 50) for first knob at top left
const AKAI_MIDIVALUES = {
  10: 16, // X
  11: 20, // Y
  12: 24, // scale
  13: 28,
  14: 46,
  15: 50,
  16: 54,
  17: 58,

  20: 17, // djbox x
  21: 21, // djbox y
  22: 25, // djbox size
  23: 29, // djbox trans

  24: 47, // ampAvg friction
  25: 51,
  26: 55, //
  27: 59, //

  30: 18, // background trans
  31: 22, // rotation
  32: 26, // transparency
  33: 30, // radius

  34: 48, // border width
  35: 52, // pulsespeed tms
  36: 56, // size (limit?)
  37: 60, // speed (limit?)

  1: 19, // count
  2: 23, // speed
  3: 27, // width
  4: 31, // depth?
  5: 49,
  6: 53,
  7: 57,
  8: 61, // count 2

  9: 62, // AMP
};

/** Left: value in midi system
 * Right: controller number on device
 */
const NOVATION_MIDIVALUES = {
  10: 13, // X
  11: 14, // Y
  12: 15, // scale
  13: 16,
  14: 17,
  15: 18,
  16: 19,
  17: 20,

  20: 29, // djbox x
  21: 30, // djbox y
  22: 31, // djbox size
  23: 32, // djbox trans

  24: 33, // ampAvg friction
  25: 34,
  26: 35, //
  27: 36, //

  30: 49, // background trans
  31: 50, // rotation
  32: 51, // transparency
  33: 52, // radius

  34: 53, // border width
  35: 54, // pulsespeed tms
  36: 55, // size (limit?)
  37: 56, // speed (limit?)

  1: 77, // count
  2: 78, // speed
  3: 79, // width
  4: 80, // depth?
  5: 81,
  6: 82,
  7: 83,
  //8: 84, // count 2

  9: 84, // AMP
};

/** CC-knobs mapped to the LED underneath them */
const NOVATION_NOTE_TO_KNOB = {
  13: 13,
  14: 29,
  15: 49,

  29: 14,
  30: 30,
  31: 50,

  45: 15,
  46: 31,
  47: 51,
  61: 16,
  62: 32,
  63: 52,
  77: 17,
  78: 33,
  79: 53,
  93: 18,
  94: 34,
  95: 54,
  109: 19,
  110: 35,
  111: 55,
  125: 20,
  126: 36,
  127: 56,
};

const INVERSE_LIGHT_MAP = Object.fromEntries(
  Object.entries(NOVATION_NOTE_TO_KNOB).map(([key, value]) => [value, key])
);

const BEAT_DETECTION_NOTE = 26;

// AKAI MIDIMIX
// names for buttons for easier use
/**
 * MIDI.isOn("C1") // true/false
 */
const AKAI_BUTTON_MAP = {
  1: "C1",
  4: "C2",
  7: "C3",
  10: "C4",
  13: "C5",
  16: "C6",
  19: "C7",
  22: "C8",
  27: "SOLO",
  3: "D1",
  6: "D2",
  9: "D3",
  12: "D4",
  15: "D5",
  18: "D6",
  21: "D7",
  24: "D8",
  25: "BANK_LEFT",
  [BEAT_DETECTION_NOTE]: "BEAT_DETECTION",
};

// LAUNCH CONTROL
const BUTTON_MAP_LC = {
  73: "D1",
  74: "D2",
  75: "D3",
  76: "D4",
  89: "D5",
  90: "D6",
  91: "D7",
  92: "D8",
  107: "SOLO",
  41: "C1",
  42: "C2",
  43: "C3",
  44: "C4",
  57: "C5",
  58: "C6",
  59: "C7",
  60: "C8",
};

/** Saved to localstorage to persist over sketch reset */
const PERSISTED_MIDI_VALUES = [10, 11, 12, 20, 21, 22, 23, 9, 30, 24, 25, 26];

/** The config number set by midi keyboard, used with config_helper.js */
let MIDI_SET_CONFIG = undefined;

const MIDI_SETUP = [
  {
    name: "MIDI Mix",
    in: "MIDI Mix",
    out: "MIDI Mix",
    buttons: AKAI_BUTTON_MAP,
    valueMap: AKAI_MIDIVALUES,
  },
  {
    name: "Launch Control",
    in: "Launch Control XL",
    out: "Launch Control XL",
    buttons: BUTTON_MAP_LC,
    valueMap: NOVATION_MIDIVALUES,
  },
];

const currentDevice = MIDI_SETUP[1];
// Buttons that set the current CONF.set values
const CONFIG_BUTTON_VALUES = ["C1", "C2", "C3", "C4", "C5", "C6"];
const CONFIG_BUTTONS = Object.entries(currentDevice.buttons)
  .map(
    ([number, name]) => CONFIG_BUTTON_VALUES.includes(name) && Number(number)
  )
  .filter(Boolean);
const BUTTON_MAP = currentDevice.buttons;
const MIDI_VALUES = currentDevice.valueMap;
const INVERTED_MAP = Object.fromEntries(
  Object.entries(MIDI_VALUES).map(([key, value]) => [value, key])
);

const getMidiStorageKey = (name) => `${name}_midi`;

let midiInput,
  fabMidi,
  midiOutput,
  midiMsg = {};

let midiThru = false; // optionally pass all in -> out

let midiValues = {};
let midiButtonValues = {};

let getMidiValue = (num, max, def) => {
  val = midiValues[MIDI_VALUES[num]];
  if (val === 0) return 0;
  if (val === undefined) return def;
  return map(val, 0, 127, 0, max);
};

let getMidiValueMin = (num, max, def, min) => {
  val = midiValues[MIDI_VALUES[num]];
  if (val === 0) return min;
  if (val === undefined) return def;
  return map(val, 0, 127, min, max);
};

p5.prototype.getMidi = getMidiValue;

p5.prototype.getMidiRound = (num, max, def, min) => {
  value = getMidiValueMin(num, max, def, min);
  return value && Math.round(value);
};

const MIDI = {
  getCount: (max, def) => parseInt(getMidiValue(1, max, def)),
  getSpeed: (max, def) => getMidiValue(2, max, def),
  getWidth: (max, def, min = 3) => getMidiValue(3, max, def),
  getDepth: (max, def) => getMidiRound(5, max, def),
  getAmpMulti: (max, def) => getMidiValue(9, max, def),
  getAmpEase: (max, def) => getMidiValue(27, max, def),
  getTrans: (max, def) => getMidiValue(32, max, def),
  getBgTrans: (max, def) => getMidiValue(30, max, def),
  getRadius: (max, def) => getMidiValue(33, max, def),
  getStroke: (max, def) => getMidiValue(34, max, def),
  getPulseSpeed: (max, def) => getMidiValue(35, max, def),
  isOn: (name) => getMidiButtonState(name) === "on",
};

function controlChange(control) {
  midiValues[control.controllerNumber] = control.value;

  const ccLightNumber = INVERSE_LIGHT_MAP[control.controllerNumber];
  ccLightNumber &&
    midiOutput.playNote(ccLightNumber, "all", {
      velocity: control.value / 127,
    });
}

let getMidiButtonName = (number) => {
  return BUTTON_MAP[number];
};

let setVelocity = (selector, velocity) => {
  midiOutput.playNote(`${selector}`, "all", {
    velocity,
  });
};

let setMidiButtonState = (number, state, velocityNumber) => {
  velocityNumber = velocityNumber ?? 1;
  const velocity = state === "on" ? velocityNumber : 0;
  setVelocity(number, velocity);
  const name = getMidiButtonName(number);
  if (!name) return;

  const key = getMidiStorageKey(name);
  midiButtonValues[key] = state;

  setToLocalStorage(key, state);
};

let getMidiButtonState = (name) => {
  let number = Object.entries(BUTTON_MAP).find(
    ([number, buttonName]) => buttonName === name
  )?.[0];

  if (!number) return;

  const key = getMidiStorageKey(name);
  const savedValue = midiButtonValues[key];

  return savedValue ?? "off";
};

const setMidiPreset = (number) => {
  for (let buttonNumber of CONFIG_BUTTONS) {
    if (buttonNumber !== number) {
      setMidiButtonState(buttonNumber, "off");
    }
    setMidiButtonState(number, "on", 1);
  }

  const configIndex = CONFIG_BUTTONS.findIndex((n) => n === number);
  MIDI_SET_CONFIG = configIndex;

  CONF.use(configIndex);
};

function persistMidiValues() {
  const valuesToPersist = R.toPairs(midiValues).filter((v) =>
    PERSISTED_MIDI_VALUES.includes(Number(INVERTED_MAP[v[0]]))
  );
  setToLocalStorage(
    "persistedMidi",
    JSON.stringify(R.fromPairs(valuesToPersist))
  );
}

function noteOn(note) {
  if (CONFIG_BUTTONS.includes(note.number)) {
    return setMidiPreset(note.number);
  }
  const name = getMidiButtonName(note.number);
  if (!name) return;

  if (name === "SOLO") {
    initLights();
    midiValues = R.pipe(
      R.toPairs,
      R.filter(([midiNumber]) =>
        PERSISTED_MIDI_VALUES.includes(Number(INVERTED_MAP[midiNumber]))
      ),
      R.fromPairs
    )(midiValues);
  }

  const currentValue = getMidiButtonState(name);

  const newValue = currentValue !== "on" ? "on" : "off";
  setMidiButtonState(note.number, newValue, 0.15);
}

// reset midi device lights
let initLights = () => {
  if (!midiOutput) return;

  if (currentDevice.name === "Launch Control") {
    Object.entries(NOVATION_NOTE_TO_KNOB).forEach(([note, knob]) => {
      midiOutput.playNote(`${note}`, "all", {
        velocity: 12,
      });
    });
  }

  for (const [number, name] of Object.entries(BUTTON_MAP)) {
    let key = getMidiStorageKey(name);
    let value = getFromLocalStorage(key);
    midiButtonValues[key] = value;
    midiOutput.playNote(`${number}`, "all", {
      velocity: value === "on" ? 1 : 0,
    });
  }
};

let getPersistedMidi = () => {
  let value = getFromLocalStorage("persistedMidi");

  const values = JSON.parse(value);
  if (!values) return;

  for (let [midiNumber, value] of Object.entries(values)) {
    midiValues[Number(midiNumber)] = value;
  }
};

function noteOff(note) {
  // midiOutput.playNote(`${note.name}${note.octave}`, 'all', {
  //     velocity: 0,
  // })
  // use note.type, .channel, .name, .number, .octave, .velocity
}
function pitchBend(pitch) {
  // use pitch.type, .channel, .value
}
function sendNote(channel, note, octave, duration, velocity) {
  midiOutput.playNote(note + octave, channel, {
    duration: duration,
    velocity: parseFloat(velocity) / 127.0,
  });
}
function parseMidi(mm) {
  //	print(mm)
  if (mm.note != undefined) {
    //print(mm.note)
    switch (mm.note.type) {
      case "noteon":
        noteOn(mm.note);
        break;
      case "noteoff":
        noteOff(mm.note);
        break;
    }
  } else if (mm.control != undefined) {
    //print(mm.control)
    controlChange(mm.control);
  }
}

p5.prototype.setupMidi = function () {
  const [nameIn, idOut] = [currentDevice.in, currentDevice.out];
  const [fabrizioIn, id2Out] = ["Scarlett 2i4 USB", "Scarlett 2i4 USB"];
  getPersistedMidi();
  WebMidi.enable(function (err) {
    if (err) {
      console.log("WebMidi could not be enabled.", err);
    }
    // Print to console available MIDI in/out id/names
    WebMidi.inputs.forEach(function (element, c) {
      print("in  [" + c + "] " + element.name);
    });
    WebMidi.outputs.forEach(function (element, c) {
      print("out [" + c + "] " + element.name);
    });

    WebMidi.inputs.forEach(function (element, c) {
      if (element.name === nameIn) {
        console.log(`${element.name} IN: ${c}`);
        midiInput = WebMidi.inputs[c];
      }
      if (element.name === fabrizioIn) {
        console.log(`fabMidi IN: ${c}`);

        fabMidi = WebMidi.inputs[c];
      }
    });

    WebMidi.outputs.forEach(function (element, c) {
      if (element.name === idOut) {
        console.log(`${element.name} OUT: ${c}`);

        midiOutput = WebMidi.outputs[c];
      }
    });

    if (midiOutput) {
      initLights(midiOutput);
    }

    try {
      fabMidi.addListener("midimessage", "all", function (e) {
        parseFabMidi(e.data);
      });

      fabMidi.addListener("noteon", "all", function (e) {
        let note = {
          type: "noteon",
        };
        note.channel = e.channel;
        note.number = e.note.number;
        note.name = e.note.name;
        note.octave = e.note.octave;
        note.velocity = floor(127 * e.velocity);

        midiMsg.note = note;
        parseFabNoteOn(midiMsg);
      });

      // noteOff
      fabMidi.addListener("noteoff", "all", function (e) {
        let note = {
          type: "noteoff",
        };
        note.channel = e.channel;
        note.number = e.note.number;
        note.name = e.note.name;
        note.octave = e.note.octave;
        note.velocity = 0;

        midiMsg.note = note;
        parseFabNoteOff(midiMsg);
      });

      fabMidi.addListener("controlchange", "all", function (e) {
        let control = {
          type: "controlchange",
        };
        control.channel = e.channel;
        control.controllerNumber = e.controller.number;
        control.controllerName = e.controller.name;
        control.value = e.value;

        midiMsg.control = control;
        parseFabControlChange(midiMsg);
      });
    } catch (error) {
      console.log("Could not add listener to midi2in", error);
    }
    midiInput.addListener("midimessage", "all", function (e) {
      if (midiThru) {
        if (e.data.length == 3) {
          midiOutput.send(e.data[0], [e.data[1], e.data[2]]);
        } else {
          midiOutput.send(e.data[0]);
        }
      }
      midiMsg = {};
      midiMsg.data = e.data;
      midiMsg.timestamp = e.timestamp;
      // parseMidi(midiMsg) // optionally send raw only
    });

    // noteOn
    midiInput.addListener("noteon", "all", function (e) {
      let note = {
        type: "noteon",
      };
      note.channel = e.channel;
      note.number = e.note.number;
      note.name = e.note.name;
      note.octave = e.note.octave;
      note.velocity = floor(127 * e.velocity);

      midiMsg.note = note;
      parseMidi(midiMsg);
    });

    // noteOff
    midiInput.addListener("noteoff", "all", function (e) {
      let note = {
        type: "noteoff",
      };
      note.channel = e.channel;
      note.number = e.note.number;
      note.name = e.note.name;
      note.octave = e.note.octave;
      note.velocity = 0;

      midiMsg.note = note;
      parseMidi(midiMsg);
    });

    midiInput.addListener("controlchange", "all", function (e) {
      let control = {
        type: "controlchange",
      };
      control.channel = e.channel;
      control.controllerNumber = e.controller.number;
      control.controllerName = e.controller.name;
      control.value = e.value;

      midiMsg.control = control;
      parseMidi(midiMsg);
    });
    // pitchBend
    midiInput.addListener("pitchbend", "all", function (e) {
      let pitch = {
        type: "pitchbend",
      };
      pitch.channel = e.channel;
      pitch.value = floor(127 * e.value);

      midiMsg.pitch = pitch;
      parseMidi(midiMsg);
    });
  });
};

const parseFabNoteOn = (note) => {
  channel = note.note.channel;
  if (!FMIDI[channel]) FMIDI[channel] = { notes: [] };

  if (note.note.velocity === 0) {
    return parseFabNoteOff(note);
  }

  FMIDI[channel].notes = [
    ...(FMIDI[channel].notes || []),
    {
      velocity: note.note.velocity,
      note: note.note.number,
      octave: note.note.octave,
      name: note.note.name,
      startFrame: frameCount,
    },
  ];
};

const parseFabNoteOff = (note) => {
  channel = note.note.channel;
  if (!FMIDI[channel]) FMIDI[channel] = { notes: [] };

  FMIDI[channel].notes = (FMIDI[channel].notes || []).filter(
    (n) => n.note !== note.note.number
  );
};

const parseFabControlChange = (control) => {
  if (control.control.channel === 1) {
    const barCount = control.control.value;
    FMIDI.BAR = barCount;
    FMIDI.BEAT = barCount * 4;
  }
};

const parseFabMidi = (message) => {
  if (!message) return;
  // continue
  if (message[0] === 251) {
    if (FMIDI.CLOCK === -1) {
      FMIDI.CLOCK = 0;
    }
  }
  // FMIDI.CLOCK + 1
  if (message[0] === 248) {
    // if (FMIDI.CLOCK === -1) return;
    FMIDI.CLOCK++;
  }
  // START
  if (message[0] === 250) {
    // FMIDI.CLOCK = 0;
  }
  FMIDI.BEAT = floor(FMIDI.CLOCK / 24);
  // FMIDI.BAR = floor(FMIDI.CLOCK / 96);
  BEAT_PROGRESS = map(FMIDI.CLOCK % 24, 0, 24, 0, 1);
  // cyclical beat progress BEAT 1 -> 0 -> 1 BEAT
  BPROG = abs(0.5 - BEAT_PROGRESS) * 2;
  CBEAT = floor(FMIDI.CLOCK / 24);
  CBAR = FMIDI.BAR;
  onCBeat = FMIDI.CLOCK % 24 === 0;
  onCBar = FMIDI.CLOCK % 96 === 0;
  onCHalfBeat = FMIDI.CLOCK % 12 === 0;
};

let getNotes = (channel) => {
  return FMIDI[channel % 16]?.notes || [];
};
let getFirstNote = (channel) => {
  return getNotes(channel)[0];
};

let getNewestNote = (channel) => {
  return getNotes(channel).slice(-1)[0];
};

let getTimeSinceChannel = (channel) => {
  return frameCount - (getFirstNote(channel)?.startFrame || frameCount);
};

let isPlaying = (channel) => getNotes(channel).length > 0;

isPlaying = (channel) => {
  return !!getNotes(channel).length > 0;
};
