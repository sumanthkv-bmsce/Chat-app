const socket =  io()

// socket.on('countUpdatedEvent',(count)=> {
//     console.log("Count has been updated ",count)
// })

// document.getElementById("clickHere").addEventListener("click",()=> {
//     console.log("clicked")
//     socket.emit("clientside")
// })  

const $messageForm = document.querySelector("#message-form")
const $messageInput = document.querySelector("#cont")
const $messageSubmit = document.querySelector("#subus")
const $messages = document.querySelector("#messages")
const $location = document.querySelector("#location")

const messageTemplate = document.getElementById("message-template").innerHTML
const locationTemplate = document.getElementById("location-template").innerHTML
const sidebartemplate = document.getElementById("sidebar-template").innerHTML

const {username,room} =  Qs.parse(location.search,{ignoreQueryPrefix:true})


const autoscroll = ()=> {

    //New Message element

    const $newMessage = $messages.lastElementChild

    //get the height of new message

    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight

    const contentHeight = $messages.scrollHeight
    
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(contentHeight-newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }




    

}

socket.on("message",(msg)=> {
    // console.log(msg)
    const html = Mustache.render(messageTemplate, {
        message:msg.text,
        createdAt:moment(msg.createdAt).format("h:mm a"),
        username:msg.username
      
    })

    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()

})

socket.on("locmessage",(val,username)=> {

    // console.log(val)
    const html = Mustache.render(locationTemplate,{
        location:val.coords,
        createdAt:moment(val.createdAt).format("h:mm a"),
        username
    })

    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()

})

socket.on("roomData",({room,users})=> {
    const html = Mustache.render(sidebartemplate,{
        room,
        users
    })

    document.getElementById("sidebar").innerHTML = html


})

const clickeUs = ()=> {
    
    event.preventDefault()
    //disable
    $messageSubmit.setAttribute('disabled','disabled')

    const val = document.querySelector("#cont").value
    document.querySelector("#cont").value = ""
    socket.emit("sendMessage",({val,username}),(err)=> {
        if(err) {
            return console.log("error")
        }

        $messageInput.focus()
        $messageSubmit.removeAttribute("disabled")
        console.log("Message was delivered")
    })

}

document.querySelector("#sendlocation").addEventListener('click',(e)=> {

    // if(!navigator.geolocation()) {
    //     return alert("Geological  is not supported by ur browser")
    // }

    document.querySelector("#sendlocation").setAttribute("disabled","disabled")

    
        socket.emit("sendLocation",{
            latitude:10,
            longitude:20
        },(msg)=> {
            document.querySelector("#sendlocation").removeAttribute("disabled")
            console.log("Location shared"+ msg)
        })
})


socket.emit("join",{username,room},(error)=> {
    if(error!==undefined) {
        alert(error)

        location.href="/"
    }
})


