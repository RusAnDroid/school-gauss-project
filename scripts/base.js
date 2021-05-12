'use strict';

function round_mod(value, precision)
{
    let precision_number = Math.pow(10, precision);
    return Math.round(value * precision_number) / precision_number;
}

class BaseMethod {
    set_matrix() {
        this.mtrx = [];
        this.mtrx.length = this.eq_num;
        for (let i = 0; i < this.mtrx.length; i++) {
            this.mtrx[i] = [];
            this.mtrx[i].length = this.var_num + 1;  
        }
        for (let i = 0; i < this.eq_num; i++) {
            for (let j = 0; j <= this.var_num; j++) {
                this.mtrx[i][j] = +this.eqs_div.children[i].children[j * 2].value;
            }
        }
    }

    constructor(var_input_id, eq_input_id, eqs_div_id, div_to_show_id) {
        this.var_num = +document.documentElement.querySelector("#" + var_input_id).value;
        this.eq_num = +document.documentElement.querySelector("#" + eq_input_id).value;
        this.eqs_div = document.documentElement.querySelector("#" + eqs_div_id);
        this.render_div = document.documentElement.querySelector("#" + div_to_show_id);
        this.set_matrix();
    }

    check_coef_arr(arr) {
        for (let i = 0; i < arr.length - 1; i += 1) {
            if (arr[i] != 0) {
                return true;
            }
        }
        return false;
    }

    check_coef_mtrx(mtrx) {
        for (let i = 0; i < mtrx.length - 1; i += 1) {
            if (this.check_coef_arr(mtrx[i])) {
                return true;
            }
        }
        return false;
    }

    get_jax_initial_set(mtrx) {
        let el = document.createElement("div");
        el.classList.add("formula");
        el.innerHTML = "\\("
        if (this.check_coef_mtrx(mtrx)) {
            el.innerHTML += "\\left\\{\\begin{array}{l}";
            for (let i = 0; i < mtrx.length; i += 1) {
                if (this.check_coef_arr(mtrx[i])) {
                    for (let j = 0; j < mtrx.length - 1; j += 1) {
                        if (mtrx[i][j] != 0) {
                            if (el.innerHTML[el.innerHTML.length - 1] == '+' && mtrx[i][j] < 0) {
                                el.innerHTML = el.innerHTML.substr(0, el.innerHTML.length - 1);
                            el.innerHTML += '-';
                            }
                            if (mtrx[i][j] != 1) {
                                el.innerHTML += "" + Math.abs(mtrx[i][j]);
                            }
                            el.innerHTML += this.create_mathjax_hint_text('x', j + 1, '+');
                        }
                    }
                    if (mtrx[i][mtrx.length - 1] != 0) {
                        if (el.innerHTML[el.innerHTML.length - 1] == '+' && mtrx[i][mtrx.length - 1] < 0) {
                            el.innerHTML = el.innerHTML.substr(0, el.innerHTML.length - 1);
                            el.innerHTML += '-';
                        }
                        if (mtrx[i][mtrx.length - 1] != 1) {
                            el.innerHTML += "" + Math.abs(mtrx[i][mtrx.length - 1]);
                        }
                        el.innerHTML += this.create_mathjax_hint_text('x', mtrx.length, '=');
                    } else {
                        el.innerHTML = el.innerHTML.substr(0, el.innerHTML.length - 1)
                        el.innerHTML += "=";
                    }
                    el.innerHTML += "" + mtrx[i][mtrx.length];
                }
                if (i < mtrx.length - 1) {
                    el.innerHTML += "\\" + "\\";
                }
            }
            el.innerHTML += "\\end{array}\\right.";
        }
        el.innerHTML += "\\)";
    
        return el;
    }
}