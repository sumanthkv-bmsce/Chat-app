const users=[]

const addUser = ({id,username,room})=> {

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room) {
        return {
            error:"Username or room are required"
        }
    }

    //check for existing user

    const existingUser = users.find((user)=> {
        return user.room === room && user.username===username
    })

    if(existingUser) {
        return {
            error:"Username is in use"
        }
    }

    //store user

    const user={
        id,
        username,
        room
    }

    users.push(user)

    return {
        user
    }

}

const removeUser = (id)=> {

    const index = users.findIndex((user)=> {
        return user.id===id
    })

    if(index!=-1) {
        return users.splice(index,1)[0]
    }
}


const getUser = (id)=> {

    const user = users.find((user)=> {
        return user.id===id
    })

    return user

}


const getUsersInRoom = (room)=> {
        
    room = room.trim().toLowerCase()
    const user1 = users.filter((user)=> {
        return user.room===room
    })

    return user1 

}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}



