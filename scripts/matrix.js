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
    
    run() {
        let main_determinant = this.get_determinant(this.mtrx);
        
        let free_terms = this.get_transposed_free_terms_arr(this.mtrx);
        this.delete_free_terms(this.mtrx);
        
        let minors_func_ans = this.get_minors(this.mtrx);
        let minors_arr = minors_func_ans[0];
        
        let adjugate_mtrx = this.get_adjugate_mtrx(minors_arr);
        let transposed_adjugate_mtrx = this.transpose_mtrx(adjugate_mtrx);
        let reversed_mtrx = this.get_reversed_mtrx(transposed_adjugate_mtrx, main_determinant);
        
        let answer_arr = this.multiply_mtrxs(reversed_mtrx, free_terms);
        console.log(this.transpose_mtrx(answer_arr));
    }
    
}

function matrix_method() {
    let matrix_method_obj = new MatrixMethod("matrix_num_input", "matrix_num_input", "matrix_div_eqs", "matrix_visualization");
    matrix_method_obj.run();
}