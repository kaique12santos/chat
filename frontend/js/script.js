

//login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

//chat elements
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const user = {id:"", name:"",color:""}

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

let websocket
const createrMessageSelfElement= (content) =>{
    const div = document.createElement("div")

    div.classList.add("message--self")
    div.innerHTML = content

    return div
}

const createrMessageOtherElement= (content,sender,senderColor) =>{
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message--other")
    div.classList.add("message--self")
    span.classList.add("message--sender")
    span.style.color=senderColor
    
    div.appendChild(span)

    span.innerHTML=sender
    div.innerHTML += content

    return div
}
const createJoinMessageElement = (userName) => {
    const div = document.createElement("div");
    div.classList.add("message--join");
    div.textContent = `${userName} se juntou à conversa`;
    return div;
};



const getRandomColor=()=>{
    const randomIndex =Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () =>{
    window.scrollTo({
        top:document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({data}) =>{
    console.log("Mensagem recebida:", data);

    const messageData = JSON.parse(data);


    // Verifica se é a mensagem de entrada do próprio usuário
    if (messageData.userID === user.id && messageData.content.endsWith("se juntou à conversa.")) {
        const joinMessageElement = createJoinMessageElement("Você"); // Cria um elemento de mensagem de entrada com "Você"
        chatMessages.appendChild(joinMessageElement);
        scrollScreen();
        return; // Sai da função
    }


    // Se for mensagem de outro usuário entrando
    if (messageData.content.endsWith("se juntou à conversa.")) {
        const joinMessageElement = createJoinMessageElement(messageData.userName); // Usa o nome de usuário recebido na mensagem
        chatMessages.appendChild(joinMessageElement);
        scrollScreen();
        return; // Sai da função
    }

    const {userID,userName,userColor,content} =JSON.parse(data)
    console.log("Dados da mensagem:", userID, userName, userColor, content);

    const message =
        userID == user.id
            ? createrMessageSelfElement(content)
            : createrMessageOtherElement(content, userName, userColor)

    chatMessages.appendChild(message)
    scrollScreen()

}

const handLeLogin = (event) =>{
    event.preventDefault()
    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color=getRandomColor()

    login.style.display="none"
    chat.style.display="flex"

    
    const firstMessage = {
        userID: user.id,
        userName: user.name,
        userColor: user.color,
        content: `${user.name} se juntou à conversa.` // Mensagem de entrada
    };
    websocket = new WebSocket("wss://chat-o0z2.onrender.com");
    websocket.onopen = () => {
        console.log("Conexão WebSocket estabelecida com sucesso!");
        // Envie a primeira mensagem aqui, dentro do onopen
        websocket.send(JSON.stringify(firstMessage));
    };
    
    websocket.onmessage = processMessage

    

    
    
    

}

const sendMessages = (event) =>{
    event.preventDefault()

    const message = {
        userID:user.id,
        userName:user.name,
        userColor:user.color,
        content:chatInput.value
    }

    websocket.send(JSON.stringify(message))
    chatInput.value=""
}

loginForm.addEventListener("submit",handLeLogin)

chatForm.addEventListener("submit", sendMessages)


