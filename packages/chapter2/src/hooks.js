console.log('test');

export function createHooks(callback) {
  let stateIndex = 0;
  const states = [];
  const memos = [];

  const useState = (initState) => {
    const currentIndex = stateIndex;
    if (states[currentIndex] === undefined) {
      states[currentIndex] = initState;
    }

    const setState = (newValue) => {
      if (states[currentIndex] === newValue) return;
      states[currentIndex] = newValue;
      render();
    };

    return [states[stateIndex++], setState];
  };

  const useMemo = (fn, deps) => {
    const currentIndex = stateIndex;
    const [lastDeps, lastValue] = memos[currentIndex] || [];

    let hasChanged = true;
    if (lastDeps) {
      hasChanged = deps.some((dep, i) => dep !== lastDeps[i]);
    }

    if (hasChanged) {
      const newValue = fn();
      memos[currentIndex] = [deps, newValue];
      return newValue;
    } else {
      return lastValue;
    }
  };

  const resetContext = () => {
    stateIndex = 0;
  };

  const render = () => {
    resetContext();
    callback();
  };

  return { useState, useMemo, resetContext };
}
