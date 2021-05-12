'use strict';

function create_input() {
    let new_input = document.createElement("input");
    new_input.setAttribute("type", "number");
    new_input.setAttribute("value", 0);
    new_input.classList.add("small-input");
    return new_input;
}

function create_mathjax_hint_element(letter, number1, sign_after) {
    let new_hint = document.createElement("span");
    new_hint.innerHTML = "\\(" + letter + "_{" + number1 + "}" + sign_after + "\\: \\)";
    return new_hint;
}

function create_system_inputfield(eq_num, var_num, main_div) {
    main_div.innerHTML = "";
    for (let i = 0; i < eq_num; i++) {
        let new_block = document.createElement("div");
        for (let j = 0; j < var_num - 1; j++) {
            new_block.appendChild(create_input());
            new_block.appendChild(create_mathjax_hint_element('x', j + 1, '+'));
        }
        if (var_num > 0) {
            new_block.appendChild(create_input());
            new_block.appendChild(create_mathjax_hint_element('x', var_num, '='));
            new_block.appendChild(create_input());
            main_div.appendChild(new_block); 
        }
    }
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "main_div"]);
}

function create_gauss_inputfield() {
    let var_num = +document.documentElement.querySelector("#gauss_var_input").value;
    let eq_num = +document.documentElement.querySelector("#gauss_eq_input").value;
    let main_div = document.documentElement.querySelector("#gauss_div_eqs");
    create_system_inputfield(eq_num, var_num, main_div);
}

document.documentElement.querySelector("#gauss_eq_input").addEventListener("input", function() {
    create_gauss_inputfield();
});                                                         
document.documentElement.querySelector("#gauss_var_input").addEventListener("input", function() {
    create_gauss_inputfield();
});
document.documentElement.querySelector("#cramer_num_input").addEventListener("input", function() {
    let var_num = +document.documentElement.querySelector("#cramer_num_input").value;
    let main_div = document.documentElement.querySelector("#cramer_div_eqs");
    let eq_num = var_num;
    create_system_inputfield(eq_num, var_num, main_div);
});                                                   

document.documentElement.querySelector("#gauss_btn_count").addEventListener("click", gauss_method);
document.documentElement.querySelector("#cramer_btn_count").addEventListener("click", cramer_method);