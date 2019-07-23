import { apiUrl } from './config';
import io from 'socket.io-client';
const socket = io(apiUrl);

const socketMiddleware = store => next => action => {
    switch (action.type) {
        case 'JOIN_ROOM_REQUEST':
            socket.emit('JOIN_ROOM_REQUEST', action.roomName);
            break;
        case 'SEND_MESSAGE':
            socket.emit('SEND_MESSAGE', action.message);
            break;
        case 'USER_CONNECTED':
            socket.emit('USER_CONNECTED', action.user);
            break;
        case 'USER_DISCONNECTED':
            socket.emit('USER_DISCONNECTED', action.user);
            break;
        default:
            break;
    }
    next(action);
};

const socketReceiver = (dispatch) => {
    // receive all event from socket server and dispatch to store
};

export {
    socketMiddleware,
    socketReceiver
}