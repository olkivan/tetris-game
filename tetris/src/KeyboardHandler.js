// The initial delay for keyboard repeat is a system-wide option
// and since we have no access to system-wide options from js
// this logic appears, also it defines different repeat delay for
// different keys

function setupKeyboardHandler(inputHandler) {
  let activeKey = {};

  document.addEventListener('keydown', event => {
    activeKey.shiftKey = event.shiftKey;
    activeKey.ctrlKey = event.ctrlKey;
    activeKey.altKey = event.altKey;

    if (!(event.code in activeKey) ||
      activeKey[event.code].code != event.code) {

      activeKey[event.code] = {
        code: event.code,
        timestamp: Date.now(),
        timeoutID: null
      };

      const updateKey = _ => {
        const repeatKeyDelay = {
          Space: 500,
          ArrowUp: 150,
          ArrowDown: 150,
          KeyP: 1000,
        }[event.code] || 50;

        if (activeKey[event.code].timeoutID) {
          clearTimeout(activeKey[event.code].timeoutID);
        }


        activeKey[event.code].timeoutID = setTimeout(_ => {
          if (Date.now() - activeKey[event.code].timestamp >= 100) {

            inputHandler.handleInputKey(activeKey[event.code].code,
              activeKey.ctrlKey, activeKey.altKey, activeKey.shiftKey);
          }

          updateKey();
        }, repeatKeyDelay);
      };

      inputHandler.handleInputKey(activeKey[event.code].code,
        activeKey.ctrlKey, activeKey.altKey, activeKey.shiftKey);

      updateKey();
    }
  });

  document.addEventListener('keyup', event => {
    if (event.code in activeKey) {
      clearTimeout(activeKey[event.code].timeoutID);
      delete activeKey[event.code];
    }
  })
}


export {
  setupKeyboardHandler
};
