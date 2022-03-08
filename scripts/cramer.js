'use strict';

class CramersMethod extends BaseMethod {
    get_determinant(mtrx) {
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
            sum += mul * mtrx[0][i] * this.get_determinant(minor_mtrx);
        }
    
        return sum
    }

    get_auxiliary_determinants(mtrx) {
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
    
            deteminants_arr[k] = this.get_determinant(new_mtrx);
        }
        let answer = [];
        answer.length = 2;
        answer[0] = deteminants_arr;
        answer[1] = mtrxs_arr;
        return answer;
    }

    get_jax_determinant(mtrx, detetminant, id) {
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

    get_jax_answer(determinant, main_determinant, id) {
        let el = document.createElement("div");
        el.classList.add("formula");
        el.innerHTML = "\\( x_{" + id + "} = \\frac{\\Delta_{x_{" + id + "}}}{\\Delta}=\\frac{" + determinant + "}{" + main_determinant + "}=" + determinant / main_determinant + "\\)";
        return el;
    }
    
    get_jax_determinant_warning() {
        let el = document.createElement("div");
        el.classList.add("formula");
        el.innerHTML = "Детерминант равен нулю => уравнение имеет либо бесконечное множетво решений, либо не имеет ни одного";
        return el;
    }
    
    render(mtrx, main_determinant, auxiliary_determinants) {
        this.render_div.innerHTML = "";
    
        this.render_div.appendChild(this.get_jax_initial_set(mtrx));
        this.render_div.appendChild(this.get_jax_determinant(mtrx, main_determinant, 0));
        if (main_determinant != 0) {
            for (let i = 0; i < mtrx.length; i += 1) {
                this.render_div.appendChild(this.get_jax_determinant(auxiliary_determinants[1][i], auxiliary_determinants[0][i], i + 1));
            }
            for (let i = 0; i < mtrx.length; i += 1) {
                this.render_div.appendChild(this.get_jax_answer(auxiliary_determinants[0][i], main_determinant, i + 1));
            }
        } else {
            this.render_div.appendChild(this.get_jax_determinant_warning());
        }
        
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "render_div"]);
    }

    run() {
        let main_determinant = this.get_determinant(this.mtrx);
        let auxiliary_determinants_func_ans = this.get_auxiliary_determinants(this.mtrx);
        let auxiliary_determinants_arr = auxiliary_determinants_func_ans[0];
        
        let answer = [];
        answer.length = this.mtrx.length;
        for (let i = 0; i < this.mtrx.length; i += 1) {
            answer[i] = auxiliary_determinants_arr[i] / main_determinant;
        }
    
        this.render(this.mtrx, main_determinant, auxiliary_determinants_func_ans);
    }
}

function cramer_method() {
    let cramer_method_obj = new CramersMethod("cramer_num_input", "cramer_num_input", "cramer_div_eqs", "cramer_visualization");
    cramer_method_obj.run();
}