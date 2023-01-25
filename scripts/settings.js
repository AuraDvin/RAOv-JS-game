function changecolor() {
    // console.log(document.getElementById('playerColor').value);
    localStorage.setItem('color', document.getElementById('playerColor').value);
}


import { defaults, setDefaults, areSettingsSet } from './inputHandler.js';
import { setMusic, setMusicTime } from './sound.js';


setMusic();
setMusicTime(parseFloat(localStorage.musicTime));
// if (localStorage.length < 8) setDefaults();
areSettingsSet();
// console.log(defaults);
/**
* TODO: now make sure there can't be multiple settings of the same key (up and down is 'w' for example)
*/

let settings = [
    { string: `move up: ${localStorage.getItem('up')}`, selected: true },
    { string: `move down: ${localStorage.getItem('down')}`, selected: false },
    { string: `move left: ${localStorage.getItem('left')}`, selected: false },
    { string: `move right: ${localStorage.getItem('right')}`, selected: false },
    { string: `music up: ${localStorage.getItem('vup')}`, selected: false },
    { string: `music down: ${localStorage.getItem('vdown')}`, selected: false },
    { string: `music mute: ${localStorage.getItem('vmute')}`, selected: false },
];

let table = document.createElement('table');
let lastImput = 0;
let keys = {};
let allowInput = true;
let inputDelay;

for (let i in settings) {
    let td = document.createElement('td');
    td.innerHTML = settings[i].string;
    td.onmouseover = updateHover;
    td.onclick = (e) => { clickEvent(); };
    if (settings[i].selected) td.className = 'selected';
    table.appendChild(td);
}
addEventListener('DOMContentLoaded', () => { 
    document.getElementById('table').appendChild(table); 
    document.getElementById('playerColor').onchange = changecolor; 
    document.getElementById('playerColor').value = localStorage.color; 
}, false);
addEventListener('keydown', handleKey, false);
addEventListener('keyup', handleKey, false);

window.requestAnimationFrame(update);

function handleKey(e) {
    const key = e.key.toLowerCase();
    const event = e.type;
    keys[key] = event === 'keydown';

    if (!allowInput) {
        if (!keys['enter'] && key !== 'enter') {
            setnew(key);
        }
    }
}


function setnew(key) {
    clearTimeout(inputDelay);
    allowInput = true;
    let lePreSetting = table.children[getSelected()].innerHTML.split(' ');
    lePreSetting[1] = lePreSetting[1].split(":")[0];
    const leSetting = lePreSetting;
    // console.log(leSetting);
    switch (leSetting[0]) {
        case 'move':
            if (key === 'escape') {
                localStorage[leSetting[1]] = defaults.move[leSetting[1]];
                table.children[getSelected()].innerHTML = leSetting[0] + ' ' + leSetting[1] + ': ' + defaults.move[leSetting[1]];
                settings[getSelected()].string = leSetting[0] + ' ' + leSetting[1] + ': ' + defaults.move[leSetting[1]];
            } else {
                localStorage[leSetting[1]] = key;
                table.children[getSelected()].innerHTML = leSetting[0] + ' ' + leSetting[1] + ': ' + key;
                settings[getSelected()].string = leSetting[0] + ' ' + leSetting[1] + ': ' + key;
            }
            break;
        case 'music':
            if (key === 'escape') {
                localStorage['v' + leSetting[1]] = defaults.music[leSetting[1]];
                table.children[getSelected()].innerHTML = leSetting[0] + ' ' + leSetting[1] + ': ' + defaults.music[leSetting[1]];
                settings[getSelected()].string = leSetting[0] + ' ' + leSetting[1] + ': ' + defaults.music[leSetting[1]];
            } else {
                localStorage['v' + leSetting[1]] = key;
                table.children[getSelected()].innerHTML = leSetting[0] + ' ' + leSetting[1] + ': ' + key;
                settings[getSelected()].string = leSetting[0] + ' ' + leSetting[1] + ': ' + key;
            }
            break;
    }
}

function clickEvent() {
    allowInput = false;
    inputDelay = setTimeout(() => { /*console.log('test');*/ allowInput = true; }, 10000); // after 10s set allowInput to true
}

function getSelected() {
    for (let i in settings) {
        if (settings[i].selected)
            return Number(i);
    }
}

function updateClasses() {
    if (allowInput) {
        let children = Array.from(table.children);
        children.forEach((e, i) => {
            if (e.classList[0] === 'selected') {
                e.classList.remove('selected');
            }
            if (i == getSelected()) {
                e.classList.add('selected');
            }
        });
    }
}

function updateHover(e) {
    if (allowInput) {
        let dis = e.target;
        const isHoveredOver = (e) => e.innerHTML === dis.innerHTML;
        if (!dis.classList.contains('selected')) {
            settings[getSelected()].selected = false;
            settings[Array.from(table.children).findIndex(isHoveredOver)].selected = true;
            updateClasses();
        }
    }
}

// <!--. UPDATE FUNCTION (important)
function update(timestamp) {
    document.getElementById('typing').hidden = allowInput;
    if (
        allowInput &&
        timestamp - lastImput >= 100 &&
        (
            keys['arrowdown'] ||
            keys['arrowup'] ||
            keys['enter'] ||
            keys['backspace']
        )

    ) {
        lastImput = timestamp;
        if (keys['arrowdown']) {
            const selected = getSelected();

            settings[selected].selected = false;

            if (selected == settings.length - 1) {
                settings[0].selected = true;
            } else {
                settings[selected + 1].selected = true;
            }


            updateClasses();
        }
        if (keys['arrowup']) {
            const selected = getSelected();
            settings[selected].selected = false;

            if (selected == 0) {
                settings[settings.length - 1].selected = true;
            } else {
                settings[selected - 1].selected = true;
            }
            updateClasses();
        }
        if (keys['enter']) {
            // console.log(getSelected());
            clickEvent();
        }
        if (keys['backspace']) {
            if (history.length > 1) {
                history.back();
            } else {
                window.location.href = './index.html';
            }
        }
    }
    window.requestAnimationFrame(update);
}
