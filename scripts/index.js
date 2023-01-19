const options = [
    { string: 'Start', selected: true, element: document.createElement('td') },
    { string: 'Options', selected: false, element: document.createElement('td') },
];
const goto = {
    'Start':  () => {window.location.href = './game.html'},
    'Options':  () => {window.location.href = './settingsAlpha.html'}
};
const action = {
    up: 'arrowup',
    down: 'arrowdown',
    action: 'enter'
};

let table = document.createElement('table');
let keys = {};
let lastFrame = 0;
let lastInput = 0;


addEventListener('keydown', handleKeys, false);
addEventListener('keyup', handleKeys, false);
addEventListener('DOMContentLoaded',() => {
    document.body.appendChild(table);
    setStrings();
},false)

function setStrings() {
    options.forEach(e => {
        let tr = document.createElement('tr');
        e.element.classList.add('prevent-select');
        e.element.innerHTML = e.string;
        e.element.onclick = goto[e.string];
        e.element.onmouseover = updateHover;
        if (e.selected) e.element.classList.add('selected');
        tr.appendChild(e.element);
        table.appendChild(tr);
    })
}

function updateHover(e) {
    const dis = e.target;
    for (let i in options) {
        options[i].selected = options[i].element == dis;
        if (options[i].selected) { options[i].element.classList.add('selected'); }
        else { options[i].element.classList.remove('selected'); }
    }
}

function getSelected() {
    for (let i in options) {
        if (options[i].selected) return i;
    }
}

function handleKeys(e) {
    keys[e.key.toLowerCase()] = e.type === 'keydown';
    // console.log(keys);
}

function checkKeys(timestamp) {
    if (lastInput + 100 > timestamp) return;

    const selectedIndex = Number(getSelected());
    if (!keys[action.action] && !keys[action.up] && !keys[action.down]) return;

    if (keys[action.action]) {
        goto[options[selectedIndex].string]();
    }

    if (keys[action.up]) {
        lastInput = timestamp;
        options[selectedIndex].selected = false;
        options[selectedIndex].element.classList.remove('selected');
        if (selectedIndex == options.length - 1) {
            options[0].selected = true;
            options[0].element.classList.add('selected');
        } else {
            options[selectedIndex + 1].selected = true;
            options[selectedIndex + 1].element.classList.add('selected');
        }
        return;
    }

    if (keys[action.down]) {
        lastInput = timestamp;
        options[selectedIndex].selected = false;
        options[selectedIndex].element.classList.remove('selected');
        if (selectedIndex == 0) {
            options[options.length - 1].selected = true;
            options[options.length - 1].element.classList.add('selected');
        } else {
            options[selectedIndex - 1].selected = true;
            options[selectedIndex - 1].element.classList.add('selected');
        }
        return;
    }
}
function update(timestamp) {
    let delta = timestamp - lastFrame;
    lastFrame = timestamp;

    checkKeys(timestamp);

    window.requestAnimationFrame(update);
}
window.requestAnimationFrame(update);