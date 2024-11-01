const express = require('express')
const http = require('http')
const app = new express()
const cors = require('cors')
const {Server}=require('socket.io')
const { Socket } = require('dgram')

app.use(cors())

const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:'http://localhost:3000',
        methods:['GET','POST']
    }
})
app.get('/',(req,res)=>{
    res.send("hello world")
})
const CHAT_BOT = 'chatBot'
let chatRoom = ''; // E.g. javascript, node,...
let allUsers = [];
io.on('connection',(socket)=>{
    console.log(`connected to socket id : ${socket.id}`)

    socket.on('join_room',(data)=>{
        const {userName,room} = data
        console.log('recieved data',userName,room)
        socket.join(room)
chatRoom = room 
allUsers.push({ id: socket.id, userName, room });
const chatRoomUsers = allUsers.filter((user) => user.room === room)
        let __createdtime__=Date.now()
        socket.to(room).emit('recieve_message',{
            message:`${userName}`,
            userName:CHAT_BOT,
            __createdtime__
        })
        socket.emit('recieve_message', {
            message: `Welcome ${userName}`,
            userName: CHAT_BOT,
            __createdtime__,
          });
          socket.to(room).emit('chatroom_users', chatRoomUsers);
    socket.emit('chatroom_users', chatRoomUsers);

    })
})

server.listen(4001,()=>{
    console.log('hey there, run server at 4001 ')
})