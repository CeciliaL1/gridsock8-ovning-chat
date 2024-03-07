import io from 'socket.io-client';
import { formDiv } from './main.js';



export function printchat(){
  const socket = io('https://shark-app-orr5n.ondigitalocean.app/');

  let sendMsg = document.createElement('input');
  sendMsg.placeholder = 'Skriv ditt meddelande';

  let sendBtn = document.createElement('button')
  sendBtn.textContent ='Skicka'


  let chatList = document.createElement('ul');
    
    sendBtn.addEventListener("click", () => {
      console.log("send chat", sendMsg.value);
      socket.emit("chat", sendMsg.value);
    })
    
    socket.on("chat", (arg) => {
      console.log("socket", arg);
      updateChat(arg);
    })
    
    function updateChat(chat) {
      let li = document.createElement("li")
      li.innerText = chat ;
      chatList.appendChild(li);
    }

    formDiv.append(chatList, sendMsg, sendBtn)
    app.appendChild(formDiv);
}