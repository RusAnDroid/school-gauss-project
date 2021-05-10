'use strict';

document.documentElement.querySelector("#btn1").addEventListener("click", function(e) {
    let var_num = +document.documentElement.querySelector("#var_input").value;
    let eq_num = +document.documentElement.querySelector("#eq_input").value;
    if (var_num < 1 || eq_num < 1) {
        console.log("Неверное число чего-то там");
        return;
    }
    let main_div = document.documentElement.querySelector("#div_eqs");
    main_div.innerHTML = "";
    for (let i = 0; i < eq_num; i++) {
        let new_block = document.createElement("div");
        for (let j = 0; j <= var_num; j++) {
            let new_input = document.createElement("input");
            new_input.setAttribute("type", "number");
            new_input.setAttribute("value", 0);
            new_block.appendChild(new_input);
        }
        main_div.appendChild(new_block);
    }
    document.documentElement.querySelector("#btn_count").removeAttribute("disabled");
}); 

document.documentElement.querySelector("#btn_count").addEventListener("click", function(e) {
    calculate();
});

document.documentElement.querySelector("#eq_input").addEventListener("input", function(e) {
    document.documentElement.querySelector("#btn_count").setAttribute("disabled", "true");
});

document.documentElement.querySelector("#var_input").addEventListener("input", function(e) {
    document.documentElement.querySelector("#btn_count").setAttribute("disabled", "true");
});


function calculate() {
    let var_num = +document.documentElement.querySelector("#var_input").value;
    let eq_num = +document.documentElement.querySelector("#eq_input").value;
    let main_div = document.documentElement.querySelector("#div_eqs");

    let mtrx = [];
    mtrx.length = eq_num;
    for (let i = 0; i < mtrx.length; i++) {
        mtrx[i] = [];
        mtrx[i].length = +var_num + 1;  
    }

    for (let i = 0; i < eq_num; i++) {
        for (let j = 0; j <= var_num; j++) {
            mtrx[i][j] = +main_div.children[i].children[j].value;
        }
    }
    
    for (let i = 0; i < mtrx[0].length - 1; i++) {
        let flag = true;
        for (let j = 0; j < mtrx.length; j++) {
            if (mtrx[j][i] != 0) flag = false;
        }
        if (flag) {
            console.log("Лишняя переменная");
            return;
        }
    }
    
    for (let i = 0; i < mtrx.length; i++) {
        let flag = true;
        for (let j = 0; j < mtrx[0].length; j++) {
            if (mtrx[i][j] != 0) flag = false;
        }
        if (flag) {
            console.log("Лишнее уравнение");
            return;
        }
    }
    
    let start_mtrx_length = mtrx[0].length;
    let answers_arr = []
    for (let i = 0; i < mtrx[0].length - 1; i++) {
        answers_arr.push(0);
    }
    
    // Straight
    let matrix_type = straiht_movement(mtrx);
    console.log(mtrx);
    if (matrix_type == 0) {
        console.log("Система немовместна");
    }
    if (matrix_type == 1) {
        console.log("Система имеет одно решение");
        let dlt = start_mtrx_length - mtrx[0].length;
        for (let i = mtrx.length - 1; i >= 0; i--) {
            reverse_movement(mtrx, answers_arr, i, dlt);
        }
    }
    if (matrix_type == 2) {
        console.log("Система имеет бесконечное количесьво решений");
    }
    console.log(answers_arr);
}

function straiht_movement(mtrx) {
    let cur_step = 0;
    while (cur_step < mtrx.length - 1) {
        let flag = false;
        while (!flag) {
            let pos = 0;
            while (pos < mtrx.length) {
                if (mtrx[pos].length == 0) mtrx.splice(pos, 1);
                else pos++;
            }
            if (cur_step == mtrx.length) {
                flag = true;
                break;
            }
            let id = cur_step;
            while (id < mtrx.length && mtrx[id][0] == 0) {
                id++;
            }
            if (id == mtrx.length) {
                for (let i = cur_step; i < mtrx.length; i++) {
                    if (mtrx[i].length > 0 && mtrx[i][0] == 0) mtrx[i].splice(0, 1);
                }
            } else {
                if (mtrx.length > 1 && id != 0 && id < mtrx.length) [mtrx[id], mtrx[cur_step]] = [mtrx[cur_step], mtrx[id]];
                break;
            }
        }
        if (flag) {
            break;
        }
        for (let i = cur_step + 1; i < mtrx.length; i++) {
            let delta = (mtrx[i][0] / mtrx[cur_step][0]) * (-1)
            for (let j = 0; j < mtrx[i].length; j++) {
                mtrx[i][j] += delta * mtrx[cur_step][j];
            }
            if (mtrx[i].length > 0 && mtrx[i][0] == 0) mtrx[i].splice(0, 1);
        }
        cur_step++;
    }
    for (let i = 0; i < mtrx.length; i++) {
        while (mtrx[i].length > 0 && mtrx[i][0] == 0) mtrx[i].splice(0, 1);
    }
    let pos = 0;
    while (pos < mtrx.length) {
        if (mtrx[pos].length == 0) mtrx.splice(pos, 1);
        else pos++;
    }
    for (let i = 0; i < mtrx.length; i++) {
        if (mtrx[i].length == 1) {
            if (mtrx[i][0] != 0) {
                return 0;
            } else {
                mtrx.splice(i, 1);
            }
        }
    }
    let flag = true;
    for (let i = 0; i < mtrx.length; i++) {
        let cnt = 0;
        for (let j = 0; j < mtrx.length; j++) {
            if (mtrx[i][j] != 0) ++cnt;
        }
        if (cnt > 2) {
            flag = false;
        }
    }
    if (flag) {
        return 1;
    }
    return 2;
}

function reverse_movement(mtrx, answers_arr, pos, delta) {
    answers_arr[pos + delta] = mtrx[pos][1] / mtrx[pos][0];
    for (let i = 0; i < mtrx.length; i++) {
        mtrx[i][mtrx[i].length - 1] += mtrx[i][mtrx[i].length - 2] * answers_arr[pos + delta] * (-1);
        mtrx[i].splice(mtrx[i].length - 2, 1);
    }
}
