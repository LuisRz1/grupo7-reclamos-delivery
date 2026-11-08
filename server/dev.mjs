import http from 'node:http';
import {createServer} from 'vite';
import board from '../api/board.js';
const vite=await createServer({server:{middlewareMode:true},appType:'spa'});
const server=http.createServer((req,res)=>{if(req.url.split('?')[0]==='/api/board'){board(req,res);return;}vite.middlewares(req,res);});
server.listen(5173,'127.0.0.1',()=>console.log('Grupo 7: http://127.0.0.1:5173'));
