'use strict';

class GaussMethod extends BaseMethod {
    static percision_number = 8;
    delete_zero_strings() {
        let new_mtrx = [];
        for (let i = 0; i < this.mtrx.length; i += 1) {
            if (this.check_coef_arr(this.mtrx[i]) || this.mtrx[i][this.mtrx[i].length - 1] != 0) {
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
        while (cur_id < this.mtrx.length && this.mtrx[cur_id][step] == 0) {
            cur_id += 1;
        }
        if (cur_id < this.mtrx.length) {
            let tmp = this.mtrx[cur_id];
            this.mtrx[cur_id] = this.mtrx[step];
            this.mtrx[step] = tmp;
        }
    }

    refactor_string(cur_string, base_string) {
        if (this.mtrx[cur_string][base_string] == 0) {
            return;
        } 
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

    count_non_zero_coefs(string_id) {
        let cnt_non_zero = 0;
        for (let j = 0; j < this.mtrx[string_id].length - 1; j += 1) {
            if (this.mtrx[string_id][j] != 0) {
                cnt_non_zero += 1;
            }
        }
        return cnt_non_zero;
    }

    check_infinite_solutions() {
        let flag = true;
        for (let i = 0; i < this.mtrx.length; i += 1) {
            if (this.count_non_zero_coefs(i) == 1) {
                flag = false;
            }
        }
        return flag;
    }

    add_new_set_to_render() {
        this.render_div.appendChild(this.get_jax_initial_set(this.mtrx));
    }

    add_initial_set_to_render() {
        this.render_div.innerHTML = "";
        this.add_new_set_to_render(this.mtrx);
    }

    step_forward(step) {
        this.delete_zero_strings();
        this.swap_strings_if_zero(step);
        for (let i = step + 1; i < this.mtrx.length; i += 1) {
            this.refactor_string(i, step);
        }
        this.delete_zero_strings();
        this.add_new_set_to_render();
        return this.check_no_solutions();
    }

    move_forward() {
        let step = 0;
        while (step < this.mtrx.length - 1) {
            let has_solution = this.step_forward(step);
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
            let cnt_non_zero = 0;
            for (let j = 0; j < this.mtrx[i].length - 1; j += 1) {
                if (this.mtrx[i][j] != 0) {
                    cnt_non_zero += 1;
                    id = j;
                }
            }
            console.log(i, cnt_non_zero, this.mtrx);
            if (cnt_non_zero == 1 && !this.used[id]) {
                this.mtrx[i][this.mtrx[i].length - 1] = this.mtrx[i][this.mtrx[i].length - 1] / this.mtrx[i][id];
                this.mtrx[i][id] = 1;
                this.used[id] = true;
                return { 
                    "id": id,
                    "value": this.mtrx[i][this.mtrx[i].length - 1]
                };
            }
        }
    }

    check_used() {
        for (let i = 0; i < this.mtrx.length; i += 1) {
            if (!this.used[i]) {
                return true;
            }
        }
        return false;
    }

    replace_var_with_zero(id, value) {
        for (let i = 0; i < this.mtrx.length; i += 1) {
            if (this.count_non_zero_coefs(i) > 1) {
                this.mtrx[i][this.mtrx[i].length - 1] -= this.mtrx[i][id] * value;
                this.mtrx[i][id] = 0;
            }
        }
    }

    create_used_array() {
        this.used = [];
        for (let i = 0; i < this.mtrx.length; i += 1) {
            this.used.push(false);
        }
    }

    move_back() {
        let answers = [];
        console.log(this.mtrx);
        answers.length = this.var_num;
        this.create_used_array();
        while (this.check_used()) {
            let obj_var = this.get_single_var_id();
            answers[obj_var.id] = round_mod(obj_var.value, GaussMethod.percision_number);
            this.replace_var_with_zero(obj_var.id, answers[obj_var.id]);
            this.delete_zero_strings();
            this.add_new_set_to_render(this.mtrx);
        }
        return answers;
    }

    add_warning_to_render(text) {
        let el = document.createElement("div");
        el.classList.add("formula");
        el.innerHTML = text;
        this.render_div.appendChild(el);
    }

    calculate() {
        let status = this.move_forward();
        if (status == 0) {
            this.add_warning_to_render("Система несовместна");
        }
        if (status == 1) {
            this.move_back();
        }
        if (status == 2) {
            this.add_warning_to_render("Система имеет бесконечное множество решений");
        }
    }

    render() {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "this.render_div"]);
    }

    run() {
        this.add_initial_set_to_render();
        this.calculate();
        this.render();
    }
}

function gauss_method() {
    let gauss_method_obj = new GaussMethod("gauss_var_input", "gauss_eq_input", "gauss_div_eqs", "gauss_visualization");
    gauss_method_obj.run();
}