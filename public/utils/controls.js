export const keys = {
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false },
    s: { pressed: false },
    space: { pressed: false }
};

export function setupControls() {
    const keysArray = Object.keys(keys);
    window.addEventListener('keydown', (event) => {
        const key = keysArray.find(k => event.code === `Key${k.toUpperCase()}` || (k === 'space' && event.code === 'Space'));
        if (key) {
            keys[key].pressed = true;
        }
    });

    window.addEventListener('keyup', (event) => {
        const key = keysArray.find(k => event.code === `Key${k.toUpperCase()}` || (k === 'space' && event.code === 'Space'));
        if (key) {
            keys[key].pressed = false;
        }
    });
}
