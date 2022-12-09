export let upPressed = false;
export let downPressed = false;
export let leftPressed = false;
export let rightPressed = false;

//! This is to avoid the shift + key bug currently in the code
/**
 * what if instead of 4 vars 
 * we use an array of elements 
 * where keys are the key codes
 * and then we can set it to TRUE or FALSE if it's on keydown/keyup
 * @param {*} event 
 * 
 * 
 * var map = {}; // You could also use an array
 *  onkeydown = onkeyup = function(e){
 *     e = e || event; // to deal with IE // What does this mean?
 *     map[e.keyCode] = e.type == 'keydown';
 *  }
 * 
 * if(map[17] && map[16] && map[65]){ // CTRL+SHIFT+A
 *     alert('Control Shift A');
 *  }else if(map[17] && map[16] && map[66]){ // CTRL+SHIFT+B
 *     alert('Control Shift B');
 *  }else if(map[17] && map[16] && map[67]){ // CTRL+SHIFT+C
 *     alert('Control Shift C');
 *  }
 * function test_key(selkey){
 *      var alias = {
 *          "ctrl":  17,
 *          "shift": 16,
 *          "A":     65,
 *      };
 *       return key[selkey] || key[alias[selkey]];
 *  }
 *   function test_keys(){
 *      var keylist = arguments;
 *       for(var i = 0; i < keylist.length; i++)
 *          if(!test_key(keylist[i]))
 *              return false;
 *       return true;
 *  }
 */



export async function handleMovement(event) {
    if (event.key === 'd' || event.key.code === 39) {
        rightPressed = true;
    } else if (event.key === 'a' || event.key.code === 37) {
        leftPressed = true;
    }

    if (event.key === 'w' || event.key === 'ArrowUp') {
        upPressed = true;
    } else if (event.key === 's' || event.key === 'ArrowDown') {
        downPressed = true;
    }

}

export async function handleStopping(event) {
    if (event.key === 'd' || event.key === 'ArrowRight') {
        rightPressed = false;
    } else if (event.key === 'a' || event.key === 'ArrowLeft') {
        leftPressed = false;
    }

    if (event.key === 'w' || event.key === 'ArrowUp') {
        upPressed = false;
    } else if (event.key === 's' || event.key === 'ArrowDown') {
        downPressed = false;
    }
}