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

function cramer_method() {
    let mtrx = get_matrix();
    let main_determinant = get_determinant(mtrx);
    console.log(main_determinant);
}