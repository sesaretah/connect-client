import io from 'socket.io-client'
import { conf } from "../conf";
//const socket = io.connect(conf.socketIOServer)
//const socket = io.connect(conf.socketIOServer, { transports: ['websocket'] })
const socket = io.connect(conf.socketIOServer, 
    { transports: ['websocket'],
    secure:true,
    reconnect: true,
    rejectUnauthorized : false }
    )
export { socket }