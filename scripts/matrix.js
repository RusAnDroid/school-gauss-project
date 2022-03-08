'use strict';

class MatrixMethod extends CramersMethod {
    
    get_algebraiс_complements(minors_arr) {
        let answer = [];
        let size = minor_arr.length;
        for (let i = 0; i < size; i += 1) {
            for (let j = 0; j < size; j += 1) {
                answer.push(Math.pow(-1, i + j) * minor_arr[i][j]);
            }
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
            
            let cur_row_mtrx = mtrx;
            cur_row_mtrx.splice(i, 1);
            
            for (let j = 0; j < size; j += 1) {
                let cur_col_mtrx = cur_row_mtrx;
                
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
        let size = mtrx.length;
        
        for (let i = 0; i < size; ++i) {
            let cur_row = [];
            for (let j = 0; j < size; ++j) {
                cur_row.push(mtrx[j][i]);
            }
            answer.push(cur_row);
        }
        
        return answer;
    }
    
    get_reversed_mtrx(transposed_adjugate_mtrx, main_determinant) {
        let size = transposed_adjugate_mtrx.length;
        let answer = transposed_adjugate_mtrx;
        for (let i = 0; i < size; i += 1) {
            for (let j = 0; j < size; j += 1) {
                answer[i][j] *= 1 / main_determinant;
            }
        }
        return answer;
    }
    
    run() {
        let main_determinant = this.get_determinant(this.mtrx);
        let minors_func_ans = this.get_minors(this.matrix);
        let minors_arr = minors_func_ans[0];
        let adjugate_mtrx = this.get_algebraic_complements(minors_arr);
        let transposed_adjugate_mtrx = this.transpose_mtrx(adjugate_mtrx);
        let reversed_mtrx = this.get_reversed_mtrx(transposed_adjugate_mtrx, main_determinant);
    }
    
}

function matrix_method() {
    let matrix_method_obj = new MatirxMethod("matrix_num_input", "matrix_num_input", "matrix_div_eqs", "matrix_visualization");
    matrix_method_obj.run();
}