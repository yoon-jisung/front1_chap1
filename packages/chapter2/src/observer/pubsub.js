let currentCallback = null;
let 상태관리객체 = {};

const keys = {
  current: 0,
  states: [],
};
function resetKey() {
  keys.current = 0;
}

export const 구독 = (fn) => {
  currentCallback = fn;
  keys.states[keys.current] = fn;
  keys.current += 1;
  fn();
};

export const 발행기관 = (obj) => {
  상태관리객체 = { ...obj };

  for (const [key, value] of Object.entries(상태관리객체)) {
    Object.defineProperty(상태관리객체, key, {
      get: function () {
        return value;
      },
      set: function (newValue) {
        // if (newValue === value) return;
        this._key = newValue;
        currentCallback();
      },
    });
  }

  return 상태관리객체;
};
