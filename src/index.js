const http = require("http")
const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const socketio = require("socket.io")
const Filter = require("bad-words")
const { getObj} = require("./utils/msgs")
const {addUser,removeUser,getUser,getUsersInRoom} = require("./utils/users")

//app function for express
const app = express()

const server = http.createServer(app)
const io = socketio(server)

//defines port
const port = process.env.PORT||3000

app.use(express.json())

const publicDirectory = path.join(__dirname,"../src/public")
app.use(express.static(publicDirectory))

//render html pages in director

app.use(express.json())

//renders html pages through ejs engine
app.engine('html', require('ejs').renderFile)

app.set('views',path.join(__dirname,"../src/htmls"))

app.use(bodyParser.urlencoded({ extended: false }));

// let count = 0;

io.on('connection',(socket)=> {
    console.log("New web socket connected")
   
    socket.on("join",({username,room},callback)=> {
        const {error,user}= addUser({id:socket.id,username,room})
        
        if(error) {
           return callback(error)
        }

        socket.join(user.room)

        socket.emit("message",getObj("Welcome","Admin"))
        socket.broadcast.to(user.room).emit("message",getObj(`${user.username} has joined`,user.username))
        if(user.room) {
            io.to(user.room).emit("roomData",{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }

         callback()    
    }) 

    socket.on("sendMessage",(msg,callback)=> {
        //  console.log(msg)
        const filter = new Filter()

        if(filter.isProfane(msg.val)) {
            return callback("Profanity is not allowed")
        }

        const user = getUser(socket.id)

        io.to(user.room).emit("message",getObj(msg.val,user.username))
        callback()
    })

    socket.on("sendLocation",(coords,callback)=> {
        console.log(coords.latitude+ " " +coords.longitude)
        const user = getUser(socket.id)
        io.to(user.room).emit("locmessage", { 
            coords: coords.latitude+ " " +coords.longitude,
            createdAt:new Date().getTime()
        },
        user.username
        )
        callback("Got it")
    })

    socket.on("disconnect",()=> {

        const user =  removeUser(socket.id)

        if(user) {
            io.to(user.room).emit("message",getObj(`${user.username} has left`,"Admin"))
            io.to(user.room).emit("roomData",{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }

        
    })
})


app.get("/",(req,res)=> {
    res.render("index.html")
})

app.get("/chat",(req,res)=> {
    res.render("chat.html")
})

server.listen(port,(req,res)=> {
    console.log("Server is in " + port)
})