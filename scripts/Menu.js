export class Menu {
    options = [];
    timestamp = 0;
    moved = false;
    //<!--? menu is dynamic and works with multiple options. but it doen't check for overflow D:
    constructor(options = []) {
        let i = 0;
        options.forEach(e => {
            this.options.push({
                string: e,
                checked: i == 0,
                place: i
            });
            i++;
        });
    }

    getSelectedItem() {
        for (var i = 0; i < this.options.length && !this.options[i].checked; i++);
        return i;
    }
    selectDown() {
        // debugger;
        for (let i = 0; i < this.options.length; i++) {
            if (this.options[i].checked) {
                this.options[i].checked = false;
                if (i + 1 >= this.options.length) {
                    this.options[0].checked = true;
                    return;
                }
                this.options[i + 1].checked = true;
                return;
            }
        }
    }
    selectUp() {
        for (let i = this.options.length - 1; i >= 0; i--) {
            if (this.options[i].checked) {
                this.options[i].checked = false;
                if (i - 1 < 0) {
                    this.options[this.options.length - 1].checked = true;
                    return;
                }
                this.options[i - 1].checked = true;
                return;
            }
        }
    }
};