const io = require('./../../app').io;
const chatSocket = require('./chatSocket');
const landSocket = require('./landSocket');
const gameSocket = require('./gameSocket');

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

const socketHandle = (socket) => {
    chatSocket(io,socket);
    landSocket(io,socket);
    gameSocket(io,socket);
};


module.exports = {
    socketHandle,
    connectedUser
};