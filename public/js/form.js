// document.getElementById('authForm').addEventListener('submit', function(event) {
//     const password = document.getElementById('password').value;
//     const confirmPassword = document.getElementById('confirm_password').value;

//     if (document.querySelector('.btn_sign').textContent === 'SIGN UP') {
//         if (password !== confirmPassword) {
//             event.preventDefault(); // Prevent form submission
//             alert('Passwords do not match.');
//         }
//     }
// });

// function sign_up() {
//     var inputs = document.querySelectorAll('.input_form_sign');
//     document.querySelectorAll('.ul_tabs > li')[0].className = "";
//     document.querySelectorAll('.ul_tabs > li')[1].className = "active";

//     for (var i = 0; i < inputs.length; i++) {
//         inputs[i].className = "input_form_sign d_block";
//         inputs[i].required = true; // Ensure all inputs are required for sign-up
//         inputs[i].disabled = false; // Ensure all inputs are enabled
//     }

//     setTimeout(function() {
//         for (var d = 0; d < inputs.length; d++) {
//             inputs[d].className = "input_form_sign d_block active_inp";
//         }
//     }, 100);

//     document.querySelector('.link_forgot_pass').style.opacity = "0";
//     document.querySelector('.link_forgot_pass').style.top = "-5px";
//     document.querySelector('.btn_sign').innerHTML = "SIGN UP";
//     document.getElementById('authForm').action = '/auth/register'; // Set form action to register

//     setTimeout(function() {
//         document.querySelector('.terms_and_cons').style.opacity = "1";
//         document.querySelector('.terms_and_cons').style.top = "5px";
//     }, 500);

//     setTimeout(function() {
//         document.querySelector('.link_forgot_pass').className = "link_forgot_pass d_none";
//         document.querySelector('.terms_and_cons').className = "terms_and_cons d_block";
//     }, 450);

//     // Ensure all fields are visible for sign-up
//     document.getElementById('confirm_password').classList.remove('d_none');
//     document.getElementById('confirm_password').required = true;
//     document.getElementById('confirm_password').disabled = false;
//     document.getElementById('phone-number').classList.remove('d_none');
//     document.getElementById('phone-number').required = true;
//     document.getElementById('phone-number').disabled = false;
//     document.getElementById('age').classList.remove('d_none');
//     document.getElementById('age').required = true;
//     document.getElementById('age').disabled = false;
// }

// function sign_in() {
//     var inputs = document.querySelectorAll('.input_form_sign');
//     document.querySelectorAll('.ul_tabs > li')[0].className = "active";
//     document.querySelectorAll('.ul_tabs > li')[1].className = "";

//     for (var i = 0; i < inputs.length; i++) {
//         inputs[i].className = "input_form_sign d_block";
//         inputs[i].required = false; // Remove required attribute for all inputs initially
//         inputs[i].disabled = true; // Disable all inputs initially
//     }

//     setTimeout(function() {
//         for (var d = 0; d < inputs.length; d++) {
//             inputs[d].className = "input_form_sign";
//             if (d === 1 || d === 2) { // Enable only email and password fields for sign-in
//                 inputs[d].className = "input_form_sign d_block active_inp";
//                 inputs[d].required = true;
//                 inputs[d].disabled = false;
//             }
//         }
//     }, 100);

//     document.querySelector('.terms_and_cons').style.opacity = "0";
//     document.querySelector('.terms_and_cons').style.top = "-5px";

//     setTimeout(function() {
//         document.querySelector('.terms_and_cons').className = "terms_and_cons d_none";
//         document.querySelector('.link_forgot_pass').className = "link_forgot_pass d_block";
//     }, 500);

//     setTimeout(function() {
//         document.querySelector('.link_forgot_pass').style.opacity = "1";
//         document.querySelector('.link_forgot_pass').style.top = "5px";
//     }, 1500);

//     document.querySelector('.btn_sign').innerHTML = "SIGN IN";
//     document.getElementById('authForm').action = '/auth/login'; // Set form action to login

//     // Ensure unnecessary fields are hidden and not required for sign in
//     document.getElementById('confirm_password').classList.add('d_none');
//     document.getElementById('confirm_password').required = false;
//     document.getElementById('confirm_password').disabled = true;
//     document.getElementById('phone-number').classList.add('d_none');
//     document.getElementById('phone-number').required = false;
//     document.getElementById('phone-number').disabled = true;
//     document.getElementById('age').classList.add('d_none');
//     document.getElementById('age').required = false;
//     document.getElementById('age').disabled = true;
// }

// window.onload = function() {
//     document.querySelector('.cont_centrar').className = "cont_centrar cent_active";
// }

function sign_up() {
    window.location.href = '/auth/register'; 
}

function sign_in() {
    window.location.href = '/auth/login'; 
}