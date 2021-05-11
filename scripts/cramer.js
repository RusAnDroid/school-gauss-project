'use strict';

function get_matrix() {
    let var_num = +document.documentElement.querySelector("#cramer_num_input").value;
    let eq_num = var_num;
    let main_div = document.documentElement.querySelector("#cramer_div_eqs");

    let mtrx = [];
    mtrx.length = eq_num;
    for (let i = 0; i < mtrx.length; i++) {
        mtrx[i] = [];
        mtrx[i].length = var_num + 1;  
    }

    for (let i = 0; i < eq_num; i++) {
        for (let j = 0; j <= var_num; j++) {
            mtrx[i][j] = +main_div.children[i].children[j * 2].value;
        }
    }

    return mtrx;
}

function get_determinant(mtrx) {
    if (mtrx.length == 2) {
        return mtrx[0][0] * mtrx[1][1] - mtrx[0][1] * mtrx[1][0];
    }

    let sum = 0;
    for (let i = 0; i < mtrx.length; i += 1) {
        let mul = 1;
        if (i % 2 == 1) {
            mul *= -1;
        }
        
        let minor_mtrx = [];
        minor_mtrx.length = mtrx.length - 1;
        let cnt = 0;
        for (let j = 1; j < mtrx.length; j += 1) {
            minor_mtrx[parseInt(cnt / minor_mtrx.length)] = [];
            minor_mtrx[parseInt(cnt / minor_mtrx.length)].length = mtrx.length - 1;
            for (let k = 0; k < mtrx.length; k += 1) {
                if (k == i) {
                    continue;
                }
                minor_mtrx[parseInt(cnt / minor_mtrx.length)][cnt % minor_mtrx.length] = mtrx[j][k];
                cnt += 1;
            }
        }
        sum += mul * mtrx[0][i] * get_determinant(minor_mtrx);
    }

    return sum
}

function get_auxiliary_determinants(mtrx) {
    let deteminants_arr = [];
    let mtrxs_arr = [];
    mtrxs_arr.length = mtrx.length;
    deteminants_arr.length = mtrx.length;
    for (let k = 0; k < mtrx.length; k += 1) {
        let new_mtrx = [];
        new_mtrx.length = mtrx.length;

        for (let i = 0; i < mtrx.length; i += 1) {
            new_mtrx[i] = [];
            new_mtrx[i].length = mtrx[i].length;
            for (let j = 0; j < mtrx[i].length; j += 1) {
                if (j == k) {
                    new_mtrx[i][j] = mtrx[i][mtrx.length];
                } else {
                    new_mtrx[i][j] = mtrx[i][j];
                }
            }
        }

        mtrxs_arr[k] = new_mtrx;

        deteminants_arr[k] = get_determinant(new_mtrx);
    }
    let answer = [];
    answer.lwngth = 2;
    answer[0] = deteminants_arr;
    answer[1] = mtrxs_arr;
    return answer;
}

function create_mathjax_hint_text(letter, number1, sign_after) {
    return letter + "_{" + number1 + "}" + sign_after;
}

function check_coef_arr(arr) {
    for (let i = 0; i < arr.length - 1; i += 1) {
        if (arr[i] != 0) {
            return true;
        }
    }
    return false;
}

function check_coef_mtrx(mtrx) {
    for (let i = 0; i < mtrx.length - 1; i += 1) {
        if (check_coef_arr(mtrx[i])) {
            return true;
        }
    }
    return false;
}


function get_jax_initial_set(mtrx) {
    let el = document.createElement("div");
    el.classList.add("formula");
    el.innerHTML = "\\("
    if (check_coef_mtrx(mtrx)) {
        el.innerHTML += "\\left\\{\\begin{array}{l}";
        for (let i = 0; i < mtrx.length; i += 1) {
            if (check_coef_arr(mtrx[i])) {
                for (let j = 0; j < mtrx.length - 1; j += 1) {
                    if (mtrx[i][j] != 0) {
                        if (el.innerHTML[el.innerHTML.length - 1] == '+' && mtrx[i][j] < 0) {
                            el.innerHTML = el.innerHTML.substr(0, el.innerHTML.length - 1);
                        el.innerHTML += '-';
                        }
                        if (mtrx[i][j] != 1) {
                            el.innerHTML += "" + Math.abs(mtrx[i][j]);
                        }
                        el.innerHTML += create_mathjax_hint_text('x', j + 1, '+');
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
                    el.innerHTML += create_mathjax_hint_text('x', mtrx.length, '=');
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

function get_jax_determinant(mtrx, detetminant, id) {
    let el = document.createElement("div");
    el.classList.add("formula");
    if (id == 0) {
        el.innerHTML = "\\( \\Delta = \\begin{vmatrix}";
    } else {
        el.innerHTML = "\\( \\Delta_{x_{" + id + "}} = \\begin{vmatrix}";
    }

    for (let i = 0; i < mtrx.length; i += 1) {
        for (let j = 0; j < mtrx.length; j += 1) {
            el.innerHTML += mtrx[i][j];
            if (j < mtrx.length - 1) {
                el.innerHTML += "&";
            }
        }
        if (i < mtrx.length - 1) {
            el.innerHTML += "\\" + "\\";
        }
    }

    el.innerHTML += "\\end{vmatrix}";

    el.innerHTML += "=" + detetminant;

    el.innerHTML += "\\)";
    return el;
}

function get_jax_answer(determinant, main_determinant, id) {
    let el = document.createElement("div");
    el.classList.add("formula");
    el.innerHTML = "\\( x_{" + id + "} = \\frac{\\Delta_{x_{" + id + "}}}{\\Delta}=\\frac{" + determinant + "}{" + main_determinant + "}=" + determinant / main_determinant + "\\)";
    return el;
}

function get_jax_determinant_warning() {
    let el = document.createElement("div");
    el.classList.add("formula");
    el.innerHTML = "Детерминант равен нулю => уравнение имеет либо бесконечное множетво решений, либо не имеет ни одного";
    return el;
}

function render(mtrx, main_determinant, auxiliary_determinants) {
    let main_div = document.documentElement.querySelector("#cramer_visualization");
    main_div.innerHTML = "";

    main_div.appendChild(get_jax_initial_set(mtrx));
    main_div.appendChild(get_jax_determinant(mtrx, main_determinant, 0));
    if (main_determinant != 0) {
        for (let i = 0; i < mtrx.length; i += 1) {
            main_div.appendChild(get_jax_determinant(auxiliary_determinants[1][i], auxiliary_determinants[0][i], i + 1));
        }
        for (let i = 0; i < mtrx.length; i += 1) {
            main_div.appendChild(get_jax_answer(auxiliary_determinants[0][i], main_determinant, i + 1));
        }
    } else {
        main_div.appendChild(get_jax_determinant_warning());
    }
    
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main_div"]);
}

function cramer_method() {
    let mtrx = get_matrix();
    let main_determinant = get_determinant(mtrx);
    let auxiliary_determinants_func_ans = get_auxiliary_determinants(mtrx);
    let auxiliary_determinants_arr = auxiliary_determinants_func_ans[0];
    
    let answer = [];
    answer.length = mtrx.length;
    for (let i = 0; i < mtrx.length; i += 1) {
        answer[i] = auxiliary_determinants_arr[i] / main_determinant;
    }

    render(mtrx, main_determinant, auxiliary_determinants_func_ans);
    
    console.log(main_determinant);
    console.log(auxiliary_determinants_arr);
    console.log(answer);
}