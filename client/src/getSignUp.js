import { logInForm } from './printLogInBtn.js';
import { formDiv } from './main.js';

export function getSignUp(username, email, password, textColour, message) {
    let regexpEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let createUser = {
        userName: username,
        userEmail: email,
        userPassword: password,
        textColour: textColour
    }

    let checkEmail = regexpEmail.test(email)
    if (!checkEmail || !password){
        message.textContent = 'Email or password not correct';
        setTimeout( ()=> {
            message.textContent = ''
         }, 2000)
    } else {
        fetch('https://shark-app-orr5n.ondigitalocean.app/api/users/add', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createUser)
        })
        .then(res => res.json())
        .then(data => {
            formDiv.innerHTML = '';
        logInForm()
    })
    }
  
} 