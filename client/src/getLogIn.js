import { printchat } from "./chat.js";
import { formDiv } from './main.js';
import { logOutBtn } from "./printLogOutBtn.js";


export function getLogIn(email, password, message) {
    let checkLogIn = {userEmail: email, userPassword: password}

    fetch('https://shark-app-orr5n.ondigitalocean.app//api/users/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(checkLogIn)
    })
    .then(res => res.json())
    .then(data => {

        if(data.message) {
            message.textContent = data.message
           setTimeout( ()=> {
            message.textContent = '';
           } , 2000)
        } else {
            formDiv.innerHTML = '';
           let setUser = JSON.stringify(data)
           localStorage.setItem('user', setUser)
            logOutBtn()
            printchat()
        }
    })
}