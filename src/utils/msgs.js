const getObj = (msg,username)=> {
    return  obj = {
        username,
        text:msg,
        createdAt:new Date().getTime()
    }
}

module.exports = {
    getObj
}