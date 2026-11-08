import {createHmac,randomUUID,timingSafeEqual} from 'node:crypto';
import {get,put} from '@vercel/blob';

const COOKIE='g7_sprint';
const IDS=['01','02','03','04','05','06'];
const STATES=['todo','doing','done'];
function sign(value){const secret=process.env.BLOB_READ_WRITE_TOKEN;if(!secret)throw new Error('Storage is not configured');return createHmac('sha256',secret).update(value).digest('base64url');}
function session(req,res){
  const cookie=(req.headers.cookie||'').split(';').map(part=>part.trim()).find(part=>part.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
  if(cookie){const [id,signature]=cookie.split('.');if(/^[a-f0-9-]{36}$/.test(id||'')&&signature){const expected=Buffer.from(sign(id));const received=Buffer.from(signature);if(expected.length===received.length&&timingSafeEqual(expected,received))return id;}}
  const id=randomUUID();const secure=req.headers['x-forwarded-proto']==='https'||Boolean(process.env.VERCEL);res.setHeader('Set-Cookie',COOKIE+'='+id+'.'+sign(id)+'; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800'+(secure?'; Secure':''));return id;
}
export function validStatuses(value){return value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===6&&IDS.every(id=>STATES.includes(value[id]));}
function json(res,status,value){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(value));}
async function body(req){if(req.body&&typeof req.body==='object')return req.body;if(typeof req.body==='string')return JSON.parse(req.body);const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>4096)throw new Error('Request too large');chunks.push(chunk);}return JSON.parse(Buffer.concat(chunks).toString('utf8'));}
export default async function handler(req,res){
  res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');
  try{
    if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return json(res,405,{error:'Método no permitido.'});}
    if(req.method==='POST'&&req.headers.origin){const origin=new URL(req.headers.origin);const host=req.headers['x-forwarded-host']||req.headers.host;if(origin.host!==host)return json(res,403,{error:'Origen no permitido.'});}
    const id=session(req,res);const pathname='boards/'+id+'.json';const options={access:'private',token:process.env.BLOB_READ_WRITE_TOKEN};
    if(req.method==='GET'){const result=await get(pathname,{...options,useCache:false});if(!result)return json(res,200,{statuses:null});const stored=await new Response(result.stream).json();return json(res,200,stored);}
    let input;try{input=await body(req);}catch{return json(res,400,{error:'Solicitud inválida.'});}
    if(!validStatuses(input.statuses))return json(res,400,{error:'Deben enviarse las seis tareas con estados válidos.'});
    const stored={statuses:Object.fromEntries(IDS.map(id=>[id,input.statuses[id]])),updatedAt:new Date().toISOString()};
    await put(pathname,JSON.stringify(stored),{...options,addRandomSuffix:false,allowOverwrite:true,contentType:'application/json',cacheControlMaxAge:60});
    return json(res,200,stored);
  }catch(error){console.error('board_request_failed',error?.message);return json(res,503,{error:'No fue posible sincronizar el tablero. Se conserva en este navegador.'});}
}
