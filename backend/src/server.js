const { WebSocketServer } = require("ws")
const dotenv = require("dotenv")

dotenv.config()

const wss = new WebSocketServer({ port: process.env.PORT || 8080 })

wss.on("connection", (ws) => {
    ws.on("error", console.error);
    
    ws.on("message", (data) => {
        const message = JSON.parse(data.toString());
        wss.clients.forEach((client) => client.send(JSON.stringify(message)))
    })

    console.log("client connected")
})
