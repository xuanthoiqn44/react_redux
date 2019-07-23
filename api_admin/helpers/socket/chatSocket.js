const chatService = require('./../../containers/chats/services');
const rpsService = require('./../../containers/events/services/')
const connectedUser = {
    users: [],

    getUsers: function () {
        return this.users;
    },

    getClientsInRoom: function (roomName) {
        let clients = [];
        if (roomName !== 'all') {
            var usersNameArr = roomName.split('-');
            usersNameArr.forEach(u => {
                let eachUser = u;
                let userObj = this.users.find(u => u.userName === eachUser);
                if (userObj)
                    clients = [...userObj.connectedClient];
            });
        }
        return clients;
    },

    getUserClientsId: function (userName) {
        var user = this.users.find(u => {
            return u.userName === userName
        });

        if (!user) return null;

        return user.connectedClient.map(cl => {
            return cl;
        });
    },

    pushUserToList: function (userName, socketId) {
        let index = -1;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].userName === userName) {
                index = i; break;
            }
        }

        if (index === -1) {
            let connectedClient = [];
            connectedClient.push(socketId);
            let user = {
                userName: userName,
                connectedClient: connectedClient
            };
            this.users.push(user);
        }
        else {
            let isExist = false;
            let _connectedClient = this.users[index].connectedClient;
            for (let i = 0; i < _connectedClient.length; i++) {
                if (_connectedClient[i] === socketId) {
                    isExist = true; break;
                }
            }
            if (!isExist) this.users[index].connectedClient.push(socketId);
        }
    },

    removeUserFromList: function (userName) {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].userName === userName) {
                this.users.splice(i, 1);
                return true;
            }
        }
        return false;
    },

    removeClientFromList: function (socketId) {
        for (let i = 0; i < this.users.length; i++) {
            let connectedClientArr = this.users[i].connectedClient;
            for (let j = 0; j < connectedClientArr.length; j++) {
                if (connectedClientArr[j] === socketId) {
                    connectedClientArr.splice(j, 1); break;
                }
            }
            if (this.users[i].connectedClient.length <= 0) {
                this.users.splice(i, 1);
                return true;
            }
        }
        return false;
    }
};
module.exports = function (io,socket) {

    socket.on("USER_CONNECTED", userName => {
        connectedUser.pushUserToList(userName, socket.id);
        io.emit("ONLINE_USER", connectedUser.getUsers());
    });

    socket.on('SEND_MESSAGE', messObj => {
        let messageDB = {
            user: messObj.user,
            type: messObj.type,
            room: messObj.roomName,
            body: messObj.data
        };
        chatService.createMess(messageDB)
            .then((newMessage) => {
                io.to(messObj.roomName).emit('PUSH_MESSAGE', newMessage);
                socket.broadcast.emit("CHAT_NOTIFICATION", messObj.roomName);
            })
            .catch(err => console.log(err))
    });

    socket.on('LEAVE_ROOM_REQUEST', roomName => {
        socket.leave(roomName);
    });

    socket.on('JOIN_ROOM_REQUEST', roomName => {
        socket.join(roomName, () => {
            chatService.getAllMessInRoom(roomName)
                .then(messages => {
                    socket.emit('FETCH_MESSAGES', messages);
                })
                .catch(err => console.log(err))
        });
    });

    socket.on('disconnect', () => {
        var removeSuccess = connectedUser.removeClientFromList(socket.id);
        if (removeSuccess) {
            io.emit("ONLINE_USER", connectedUser.getUsers());
        }
    });

    socket.on('USER_DISCONNECTED', (userName) => {
        var removeSuccess = connectedUser.removeUserFromList(userName);
        if (removeSuccess) {
            io.emit("ONLINE_USER", connectedUser.getUsers());
        }
    });

    socket.on("GET_EVENT_USERS_REQUEST", () => {
        rpsService.getEventUsersCount()
            .then(usersCount => io.emit("EVENT_USERS_COUNT", usersCount));
    });
}