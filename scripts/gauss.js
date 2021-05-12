'use strict';

class GaussMethod extends BaseMethod {
    static percision_number = 8;
    delete_zero_strings() {
        let new_mtrx = [];
        for (let i = 0; i < this.mtrx.length; i += 1) {
            if (this.check_coef_arr(this.mtrx[i])) {
                new_mtrx.push(this.mtrx[i]);
            }
        }
        this.mtrx = new_mtrx;
    }

    swap_strings_if_zero(step) {
        if (this.mtrx[step][step] != 0) {
            return;
        }
        let cur_id = step;
        while (cur_id < this.mtrx.length && this.mtrx[cur_id][id] == 0) {
            cur_id += 1;
        }
        if (cur_if < this.mtrx.length) {
            let tmp = this.mtrx[cur_id];
            this.mtrx[cur_id] = this.mtrx[step];
            this.mtrx[step] = tmp;
        }
    }

    refactor_string(cur_string, base_string) {
        let multiplier = (-1) * (this.mtrx[cur_string][base_string] / this.mtrx[base_string][base_string]);
        for (let i = base_string; i < this.mtrx[cur_string].length; i += 1) {
            this.mtrx[cur_string][i] += multiplier * this.mtrx[base_string][i];
        }
    }

    check_last_no_zero(string_id, cnt) {
        let flag_prev_zero = true;
        for (let j = 0; j < this.mtrx[string_id].length - cnt; j += 1) {
            if (this.mtrx[string_id][j] != 0) {
                flag_prev_zero = false;
            }
        }
        let flag_last_nozero = true;
        for (let j = this.mtrx[string_id].length - cnt; j < this.mtrx[string_id].length; j += 1) {
            if (this.mtrx[string_id][j] == 0) {
                flag_last_nozero = false;
            }
        }
        return (flag_prev_zero && flag_last_nozero);
    }

    check_no_solutions() {
        for (let i = 0; i < this.mtrx.length; i += 1) {
            if (this.check_last_no_zero(i, 1)) {
                return false;
            }
        }
        return true;
    }

    check_infinite_solutions() {
        let cnt_no_zero = 0;
        let flag = true;
        for (let i = 0; i < this.mtrx.length; i += 1) {
            cnt_no_zero = 0;
            for (let j = 0; j < this.mtrx[i].length - 1; j += 1) {
                if (this.mtrx[i][j] != 0) {
                    cnt_no_zero += 1;
                }
            }
            if (cnt_no_zero == 1) {
                flag = false;
            }
        }
        return flag;
    }

    step_forward_movement(step) {
        this.delete_zero_strings();
        this.swap_strings_if_zero(step);
        for (let i = step + 1; i < this.mtrx.length; i += 1) {
            this.refactor_string(i, step);
        }
        this.delete_zero_strings();
        return this.check_no_solutions();
    }

    move_forward() {
        let step = 0;
        while (step < this.mtrx.length) {
            let has_solution = this.step_forward_movement(step);
            if (!has_solution) {
                return 0; // no solutions
            }
            step += 1;
        }
        if (this.check_infinite_solutions()) {
            return 2; // infinite solutions
        }
        return 1; // one solution;
    }

    get_single_var_id() {
        let id = -1;
        for (let i = 0; i < this.mtrx.length; i += 1) {
            let cnt_no_zero = 0;
            for (let j = 0; j < this.mtrx[i].length - 1; j += 1) {
                if (this.mtrx[i][j] != 0) {
                    cnt_no_zero += 1;
                    id = j;
                }
            }
            if (cnt_no_zero == 1) {
                return { 
                    "id": id,
                    "value": this.mtrx[i][this.mtrx[i].length - 1] / this.mtrx[i][id]
                };
            }
        }
    }

    replace_var_with_zero(id, value) {
        for (let i = 0; i < this.mtrx.length; i += 1) {
            this.mtrx[i][this.mtrx[i].length - 1] -= this.mtrx[i][id] * value;
            this.mtrx[i][id] = 0;
        }
    }

    move_back() {
        let answers = [];
        answers.length = this.var_num;
        for (let i = 0; i < this.var_num; i += 1) {
            let obj_var = this.get_single_var_id();
            answers[obj_var.id] = round_mod(obj_var.value, GaussMethod.percision_number);
            this.replace_var_with_zero(obj_var.id, answers[obj_var.id]);
            this.delete_zero_strings();
        }
        return answers;
    }

    calculate() {
        let status = this.move_forward();
        if (status == 0) {
            // TODO
        }
        if (status == 1) {
            console.log(this.move_back());
        }
        if (status == 2) {
            // TODO
        }
    }

    run() {
        console.log(this.mtrx)
        this.calculate();
    }
}

function gauss_method() {
    let gauss_method_obj = new GaussMethod("gauss_var_input", "gauss_eq_input", "gauss_div_eqs", "gauss_visualization");
    gauss_method_obj.run();
}