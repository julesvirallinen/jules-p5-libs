let PRESET_DEFS = [];
let DEFAULT_PRESET = {};
let MIDI_OVERRIDES = {};
let SET_PRESET = {};
let C = {};

const getDefaultMidiValues = () => ({
  count: MIDI.getCount(10, null) * (getMidiValue(37, 30, 1) + 1),
  speed: MIDI.getSpeed(1, null),
  size: MIDI.getWidth(200, null),

  depth: MIDI.getDepth(1, null),
  strokeWeight: MIDI.getStroke(10, null),
  transparency: MIDI.getTrans(1, null),
  trans: C.transparency,
  rotate: getMidiValue(31, 360, null),
  radius: MIDI.getRadius(1, null),
  // ? Should this debounce?
  pulseSpeed: MIDI.getPulseSpeed(1, null),
  bgTrans: MIDI.getBgTrans(0.5, null),
  ampFriction: getMidiValue(24, 1, 0.1),
  melodyFriction: getMidiValue(25, 1, 0.1),
  drumFriction: getMidiValue(26, 1, 0.1),
  party: MIDI.isOn("D6"),
  isBeatDetectionOn: MIDI.isOn("BEAT_DETECTION"),
});

const merge_config_presets = () => {
  // C.base to use predefined values
  // because spread syntax is not available
  presetValues = Object.assign({}, SET_PRESET?.base || {}, SET_PRESET);
  const presetWithDefaults = R.mergeDeepLeft(presetValues, DEFAULT_PRESET);
  let midiPresetWithDefaults = R.mergeDeepLeft(
    MIDI_OVERRIDES,
    getDefaultMidiValues()
  );
  C = R.mergeDeepWithKey(
    (key, midiVal, presetVal) => {
      let val;
      if ((SET_PRESET?.OVERRIDES || []).includes(key)) val = presetVal;
      else if (Number.isNaN(midiVal)) val = presetVal;
      else if (R.isNil(midiVal)) val = presetVal;
      else val = midiVal;
      if ((MIDI_OVERRIDES?.NOEASE || []).includes(key)) return val;
      if (typeof val == "boolean") {
        return val;
      }
      return ease(val, C[key] || 0, 0.1);
    },
    midiPresetWithDefaults,
    presetWithDefaults
  );
};

const CONF = {
  defaults: (preset) => {
    DEFAULT_PRESET = preset;
  },
  set: (presets) => {
    PRESET_DEFS = presets;
    const index = getFromLocalStorageOrDefaultTo("configIndex", 0);

    SET_PRESET = getI(PRESET_DEFS, index);
    merge_config_presets();
  },
  setMidi: (preset) => {
    MIDI_OVERRIDES = preset;
    merge_config_presets();
  },
  /** This is what setupMidi uses when switching */
  use: (i) => {
    const index = setToLocalStorage("configIndex", i);
    //  console.log(index)
    SET_PRESET = getI(PRESET_DEFS, i);
    merge_config_presets();
  },
};
