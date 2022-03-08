'use strict';

class MatrixMethod extends CramersMethod {
    
    get_adjugate_mtrx(minors_arr) {
        let answer = [];
        let size = minors_arr.length;
        for (let i = 0; i < size; i += 1) {
            let cur_row = [];
            for (let j = 0; j < size; j += 1) {
                cur_row.push(Math.pow(-1, (i + 1) + (j + 1)) * minors_arr[i][j]);
            }
            answer.push(cur_row);
        }
        return answer;
    }
    
    get_minors(mtrx) {
        let size = mtrx.length;
        let minors_values = [];
        let minors_mtrxs = [];
        
        for (let i = 0; i < size; i += 1) {
            let cur_minors_values = [];
            let cur_minors_mtrxs = [];
            
            let cur_row_mtrx = JSON.parse(JSON.stringify(mtrx));
            cur_row_mtrx.splice(i, 1);
            
            for (let j = 0; j < size; j += 1) {
                let cur_col_mtrx = JSON.parse(JSON.stringify(cur_row_mtrx));
                
                for (let k = 0; k < size - 1; k += 1) {
                    cur_col_mtrx[k].splice(j, 1);
                }
                
                cur_minors_mtrxs.push(cur_col_mtrx);
                cur_minors_values.push(this.get_determinant(cur_col_mtrx));
            }
            
            minors_values.push(cur_minors_values);
            minors_mtrxs.push(cur_minors_mtrxs);
        }
        
        let answer = [];
        answer.push(minors_values);
        answer.push(minors_mtrxs);
        return answer;
    }
    
    transpose_mtrx(mtrx) {
        let answer = [];
        
        for (let i = 0; i < mtrx[0].length; ++i) {
            let cur_row = [];
            for (let j = 0; j < mtrx.length; ++j) {
                cur_row.push(mtrx[j][i]);
            }
            answer.push(cur_row);
        }
        
        return answer;
    }
    
    get_reversed_mtrx(transposed_adjugate_mtrx, main_determinant) {
        let size = transposed_adjugate_mtrx.length;
        let answer = JSON.parse(JSON.stringify(transposed_adjugate_mtrx));
        for (let i = 0; i < size; i += 1) {
            for (let j = 0; j < size; j += 1) {
                answer[i][j] *= 1 / main_determinant;
            }
        }
        return answer;
    }
    
    multiply_mtrxs(mtrx1, mtrx2) {
        let answer_mtrx = [];
        
        for (let mtrx1_row = 0; mtrx1_row < mtrx1.length; mtrx1_row += 1) {
            let cur_row = [];
            
            for (let mtrx2_col = 0; mtrx2_col < mtrx2[0].length; mtrx2_col += 1) {
                let sum = 0;
                
                for (let mtrx1_col = 0, mtrx2_row = 0; mtrx2_row < mtrx2.length; mtrx1_col += 1, mtrx2_row += 1) {
                    sum += mtrx1[mtrx1_row][mtrx1_col] * mtrx2[mtrx2_row][mtrx2_col];
                }
                
                cur_row.push(sum);
            }
            
            answer_mtrx.push(cur_row);
        }
        
        return answer_mtrx;
    }
    
    get_transposed_free_terms_arr(mtrx) {
        let answer = [];
        for (let i = 0; i < mtrx.length; i += 1) {
            answer.push([mtrx[i][mtrx[i].length - 1]]);
        }
        return answer;
    }
    
    delete_free_terms(mtrx) {
        for (let i = 0; i < mtrx.length; i += 1) {
            mtrx[i].splice(mtrx[i].length - 1, 1);
        }
    }
    
    get_jax_mtrx_inner(mtrx) {
        let str = "";
        
        for (let i = 0; i < mtrx.length; i += 1) {
            for (let j = 0; j < mtrx[i].length; j += 1) {
                str += mtrx[i][j];
                
                if (j < mtrx[i].length - 1) {
                    str += "&";
                }
            }
            if (i < mtrx.length - 1) {
                str += "\\" + "\\";
            }
        }
        
        return str;
    }
    
    get_jax_vmtrx_string(mtrx) {
        let str = "\\begin{vmatrix}";
        
        str += this.get_jax_mtrx_inner(mtrx);
        
        str += "\\end{vmatrix}";
        
        return str;
    }
    
    get_jax_pmtrx_string(mtrx) {
        let str = "\\begin{pmatrix}";
        
        str += this.get_jax_mtrx_inner(mtrx);
        
        str += "\\end{pmatrix}";
        
        return str;
    }
    
    get_jax_algebraic_complement(row, col, minors_arr) {
        let el = document.createElement("div");
        el.classList.add("formula");
        el.innerHTML = "\\(A_{" + (row + 1) + "," + (col + 1) + "} = ";
        el.innerHTML += "(-1)^{" + (row + 1) + "+" + (col + 1) + "} \\cdot"
        
        let minors_mtrxs = minors_arr[1];
        el.innerHTML += this.get_jax_vmtrx_string(minors_mtrxs[row][col]);
        
        el.innerHTML += "=" + minors_arr[0][row][col];
        el.innerHTML += "\\)";
        
        return el;
    }
    
    get_jax_adjugate_mtrx(adjugate_mtrx) {
        let el = document.createElement("div");
        el.classList.add("formula");
        el.innerHTML = "\\( С^{*} = ";
        el.innerHTML += this.get_jax_pmtrx_string(adjugate_mtrx);
        el.innerHTML += "\\)";
        return el;
    }
    
    get_jax_transposed_adjugate_mtrx(transposed_adjugate_mtrx) {
        let el = document.createElement("div");
        el.classList.add("formula");
        el.innerHTML = "\\( (С^{*})^{T} = ";
        el.innerHTML += this.get_jax_pmtrx_string(transposed_adjugate_mtrx);
        el.innerHTML += "\\)";
        return el;
    }
    
    get_jax_reversed_mtrx_string(reversed_mtrx, main_determinant) {
        let str = "\\begin{pmatrix}";
        
        for (let i = 0; i < reversed_mtrx.length; i += 1) {
            for (let j = 0; j < reversed_mtrx[i].length; j += 1) {
                str += "\\frac{" + reversed_mtrx[i][j] + "}{" + main_determinant + "}";
                
                if (j < reversed_mtrx[i].length - 1) {
                    str += "&";
                }
            }
            if (i < reversed_mtrx.length - 1) {
                str += "\\" + "\\";
            }
        }
        
        str += "\\end{pmatrix}";
        return str;
    }
    
    get_jax_reversed_mtrx(transposed_adjugate_mtrx, main_determinant) {
        let el = document.createElement("div");
        el.classList.add("formula");
        el.innerHTML = "\\("
        
        el.innerHTML += "A^{-1} = \\frac{1}{\\Delta} \\cdot (С^{*})^{T} = ";
        el.innerHTML += "\\frac{1}{" + main_determinant + "} \\cdot";
        el.innerHTML += this.get_jax_pmtrx_string(transposed_adjugate_mtrx) + "=";
        el.innerHTML += this.get_jax_reversed_mtrx_string(transposed_adjugate_mtrx, main_determinant);
        
        el.innerHTML += "\\)";
        return el;
    }
    
    get_jax_answer(transposed_adjugate_mtrx, main_determinant, free_terms_arr, answers_arr) {
        let el = document.createElement("div");
        el.classList.add("formula");
        el.innerHTML = "\\("
        
        el.innerHTML += "X = A^{-1} \\cdot B = ";
        el.innerHTML += this.get_jax_reversed_mtrx_string(transposed_adjugate_mtrx, main_determinant);
        el.innerHTML += "\\times";
        el.innerHTML += this.get_jax_pmtrx_string(free_terms_arr);
        el.innerHTML += "=";
        el.innerHTML += this.get_jax_pmtrx_string(answers_arr);
        
        el.innerHTML += "\\)";
        return el;
    }
    
    build_answers_mtrx(answers_arr) {
        let mtrx = [];
        for (let i = 0; i < answers_arr.length; i += 1) {
            let cur_arr = [];
            for (let j = 0; j < answers_arr.length; j += 1) {
                cur_arr.push(0);
            }
            cur_arr[i] = 1;
            cur_arr.push(answers_arr[i]);
            mtrx.push(cur_arr);
        }
        return mtrx;
    }
    
    get_jax_answers_set(answers_arr) {
        let answers_mtrx = this.build_answers_mtrx(answers_arr);
        return this.get_jax_initial_set(answers_mtrx);
    }
    
    render(mtrx, main_determinant, minors_arr, adjugate_mtrx, transposed_adjugate_mtrx, reversed_mtrx, free_terms_arr, answers_arr) {
        this.render_div.innerHTML = "";
    
        this.render_div.appendChild(this.get_jax_initial_set(mtrx));
        this.render_div.appendChild(this.get_jax_determinant(mtrx, main_determinant, 0));
        if (main_determinant != 0) {
            
            for (let i = 0; i < mtrx.length; i += 1) {
                for (let j = 0; j < mtrx.length; j += 1) {
                    this.render_div.appendChild(this.get_jax_algebraic_complement(i, j, minors_arr));
                }
            }
            
            this.render_div.appendChild(this.get_jax_adjugate_mtrx(adjugate_mtrx));
            this.render_div.appendChild(this.get_jax_transposed_adjugate_mtrx(transposed_adjugate_mtrx));
            this.render_div.appendChild(this.get_jax_reversed_mtrx(transposed_adjugate_mtrx, main_determinant));
            this.render_div.appendChild(this.get_jax_answer(transposed_adjugate_mtrx, main_determinant, free_terms_arr, answers_arr));
            this.render_div.appendChild(this.get_jax_answers_set(answers_arr));
            
        } else {
            this.render_div.appendChild(this.get_jax_determinant_warning());
        }
        
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "render_div"]);
    }
    
    run() {
        let main_determinant = this.get_determinant(this.mtrx);
        
        let free_terms_arr = this.get_transposed_free_terms_arr(this.mtrx);
        this.delete_free_terms(this.mtrx);
        
        let minors_func_ans = this.get_minors(this.mtrx);
        let minors_arr = minors_func_ans[0];
        
        let adjugate_mtrx = this.get_adjugate_mtrx(minors_arr);
        let transposed_adjugate_mtrx = this.transpose_mtrx(adjugate_mtrx);
        let reversed_mtrx = this.get_reversed_mtrx(transposed_adjugate_mtrx, main_determinant);
        
        let answers_arr = this.multiply_mtrxs(reversed_mtrx, free_terms_arr);
        
        this.render(this.mtrx, main_determinant, minors_func_ans, adjugate_mtrx, transposed_adjugate_mtrx, reversed_mtrx, free_terms_arr, answers_arr);
    }
    
}

function matrix_method() {
    let matrix_method_obj = new MatrixMethod("matrix_num_input", "matrix_num_input", "matrix_div_eqs", "matrix_visualization");
    matrix_method_obj.run();
}