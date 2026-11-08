import './style.css';

const tasks = [
  {id:'01',title:'Maquetar interfaz de selección de motivo de reclamo',description:'Selección del motivo y descripción obligatoria del inconveniente.',area:['front'],owner:'Leonardo',initials:'LC',status:'done',detail:'El Daily reporta las tareas 01 y 02 terminadas. La interfaz debe ofrecer los tres motivos de la HU y señalar los campos obligatorios.',checks:['Faltó un producto.','Producto equivocado.','Comida dañada o derramada.','Descripción obligatoria y campos pendientes señalados.']},
  {id:'02',title:'Construir componente de carga y vista previa de fotos',description:'Adjuntos desde cámara o galería, con vista previa antes del envío.',area:['front'],owner:'Leonardo',initials:'LC',status:'done',detail:'Leonardo reportó el componente terminado en su Daily. Se requieren entre una y tres fotos por reclamo.',checks:['Selección desde cámara o galería.','Vista previa de las fotografías seleccionadas.','Entre 1 y 3 fotografías por reclamo.']},
  {id:'03',title:'Validar límite de peso (5 MB) y formato de archivos',description:'Validar JPG, JPEG o PNG y hasta 5 MB por fotografía en Backend.',area:['back'],owner:'Josue',initials:'JL',status:'todo',detail:'El tablero compartido por el equipo ubica esta tarea en To Do y la asigna a Backend. El límite de 5 MB fue coordinado con Frontend.',checks:['Formatos JPG, JPEG y PNG.','Máximo de 5 MB por foto (criterio asumido para el demo).','Bloquear archivos inválidos y mostrar el motivo.','Validar las reglas en Backend.']},
  {id:'04',title:'Crear API en backend para recibir reclamos y guardar imágenes',description:'POST /api/claims y tabla creados. Continúa la carga de fotos y el folio único.',area:['back'],owner:'Josue',initials:'JL',status:'doing',detail:'Según su Daily, Josue creó POST /api/claims y la tabla de reclamos. Continúa con la subida y guardado de fotos y la generación del folio único.',checks:['Pedido entregado durante las últimas 48 horas.','Recibir motivo, descripción e imágenes válidas.','Guardar el reclamo y sus evidencias.','Conservar un único reclamo ante reintentos.']},
  {id:'05',title:'Diseñar modal de confirmación con el ID del ticket',description:'Confirmación del reclamo, número de atención y tiempo estimado de respuesta.',area:['front'],owner:'Leonardo',initials:'LC',status:'doing',detail:'Leonardo indicó que hoy trabajaría en el modal final con el ID del ticket. Su avance reportado de Frontend es 80 %.',checks:['Mostrar el ID del ticket devuelto por la API.','Mostrar «Te responderemos en menos de 24 horas».','Modal legible, accesible y fácil de cerrar.']},
  {id:'06',title:'Pruebas funcionales de extremo a extremo (E2E)',description:'Pruebas en curso del flujo completo, las reglas de negocio y los casos de error.',area:['qa'],owner:'Kevin',initials:'KQ',status:'doing',detail:'El tablero compartido por el equipo ubica las pruebas E2E en Doing. Kevin participa como Developer con enfoque en QA; la validación del flujo continúa.',checks:['Pedidos dentro y fuera del plazo de 48 horas.','Motivo o descripción vacíos.','0, 1, 3 y 4 fotos; formatos y tamaños inválidos.','Pulsaciones repetidas y reintentos sin duplicados.','Ticket y tiempo estimado de respuesta.']}
];
const labels={todo:'To Do',doing:'Doing',done:'Done'};
const areaLabels={front:'Frontend',back:'Backend',qa:'QA'};
const initialStatuses=Object.fromEntries(tasks.map(task=>[task.id,task.status]));
const storageKey='grupo7-sprint-board-v1';
let statuses={...initialStatuses};
let saving=Promise.resolve();
let changedWhileLoading=false;
try{const saved=JSON.parse(localStorage.getItem(storageKey));if(isValid(saved))statuses=saved;}catch{}
const $=id=>document.getElementById(id);
const dialog=$('detail-dialog');
function isValid(value){return value&&tasks.every(task=>Object.keys(labels).includes(value[task.id]));}
function element(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
function showDialog(eyebrow,title,content){$('dialog-eyebrow').textContent=eyebrow;$('dialog-title').textContent=title;$('dialog-body').replaceChildren(...content);dialog.showModal();}
function taskDetail(task){const summary=element('p','',task.detail);const owner=element('p','','Responsable: '+task.owner+' · Estado: '+labels[statuses[task.id]]);const heading=element('strong','','Criterios de revisión');const list=element('ul');task.checks.forEach(check=>list.append(element('li','',check)));showDialog('HU-G7-01 · TAREA '+task.id,task.title,[summary,owner,heading,list]);}
function render(){
  const search=$('task-search').value.trim().toLocaleLowerCase('es');const area=$('area-filter').value;
  for(const state of Object.keys(labels)){
    const list=$('list-'+state);list.replaceChildren();
    const all=tasks.filter(task=>statuses[task.id]===state);$('count-'+state).textContent=all.length;
    const visible=all.filter(task=>(area==='all'||task.area.includes(area))&&[task.title,task.description,task.owner].join(' ').toLocaleLowerCase('es').includes(search));
    for(const task of visible){
      const card=element('article','task-card');card.draggable=true;card.dataset.taskId=task.id;card.setAttribute('aria-label','Tarea '+task.id+': '+task.title);
      const meta=element('div','task-meta');meta.append(element('span','task-id','G7–'+task.id));const more=element('button','task-more','•••');more.type='button';more.setAttribute('aria-label','Ver detalle de la tarea '+task.id);more.addEventListener('click',()=>taskDetail(task));meta.append(more);
      const title=element('button','task-title',task.title);title.type='button';title.addEventListener('click',()=>taskDetail(task));
      const description=element('p','task-description',task.description);const tags=element('div','tags');task.area.forEach(type=>tags.append(element('span','tag '+type,areaLabels[type])));
      if(task.unconfirmed&&statuses[task.id]==='todo')tags.append(element('span','tag note','Por confirmar'));if(statuses[task.id]==='done')tags.append(element('span','tag completed','Completada'));
      const bottom=element('div','task-bottom');const owner=element('span','assignee');owner.append(element('span','assignee-icon',task.initials),element('span','assignee-label',task.owner));
      const select=element('select','state-select');select.id='state-'+task.id;select.setAttribute('aria-label','Estado de la tarea '+task.id);for(const [value,label]of Object.entries(labels)){const option=element('option','',label);option.value=value;select.append(option);}select.value=statuses[task.id];select.addEventListener('change',()=>{changeStatus(task.id,select.value);$('state-'+task.id)?.focus();});bottom.append(owner,select);
      card.append(meta,title,description,tags,bottom);
      card.addEventListener('dragstart',event=>{if(event.target.closest('select')){event.preventDefault();return;}event.dataTransfer.setData('text/plain',task.id);event.dataTransfer.effectAllowed='move';card.classList.add('dragging');});card.addEventListener('dragend',()=>{card.classList.remove('dragging');document.querySelectorAll('.column').forEach(column=>column.classList.remove('drag-over'));});list.append(card);
    }
    if(!visible.length)list.append(element('p','empty-column',all.length?'Sin coincidencias para este filtro.':'Arrastra una tarea aquí.'));
  }
  const completed=tasks.filter(task=>statuses[task.id]==='done').length;const percent=Math.round(completed/tasks.length*100);$('done-metric').textContent=String(completed).padStart(2,'0');$('progress-metric').replaceChildren(document.createTextNode(percent),element('span','','%'));$('progress-fill').style.width=percent+'%';
}
function persist(){
  changedWhileLoading=true;
  try{localStorage.setItem(storageKey,JSON.stringify(statuses));}catch{}
  const snapshot={...statuses};$('save-status').textContent='Guardando cambios…';
  saving=saving.catch(()=>{}).then(async()=>{try{const response=await fetch('/api/board',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({statuses:snapshot}),signal:AbortSignal.timeout(12000)});if(!response.ok)throw new Error('save');$('save-status').textContent='✓ Cambios guardados';}catch{$('save-status').textContent='Guardado en este navegador';}});
}
function changeStatus(id,state){if(!tasks.some(task=>task.id===id)||!labels[state])return;statuses[id]=state;render();persist();}
document.querySelectorAll('.column').forEach(column=>{column.addEventListener('dragover',event=>{event.preventDefault();event.dataTransfer.dropEffect='move';column.classList.add('drag-over');});column.addEventListener('dragleave',event=>{if(!column.contains(event.relatedTarget))column.classList.remove('drag-over');});column.addEventListener('drop',event=>{event.preventDefault();column.classList.remove('drag-over');changeStatus(event.dataTransfer.getData('text/plain'),column.dataset.status);});});
$('task-search').addEventListener('input',render);$('area-filter').addEventListener('change',render);
$('reset-board').addEventListener('click',()=>{statuses={...initialStatuses};$('task-search').value='';$('area-filter').value='all';render();persist();});
$('close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
$('show-story').addEventListener('click',()=>{
  const story=element('p','','Como cliente de la aplicación, quiero realizar un reclamo asociado a mi pedido para solicitar una solución del inconveniente presentado.');const list=element('ul');[
    'Mostrar «Reportar problema» en pedidos entregados durante las últimas 48 horas.',
    'Motivo obligatorio: Faltó un producto, Producto equivocado o Comida dañada o derramada.',
    'Descripción obligatoria; señalar campos pendientes e impedir el envío.',
    'Entre 1 y 3 fotos desde cámara o galería en JPG, JPEG o PNG. El backlog añade un máximo de 5 MB, considerado por foto.',
    'Conservar un único reclamo ante pulsaciones repetidas o reintentos.',
    'Generar el ID del ticket y mostrar el tiempo estimado de respuesta.'
  ].forEach(text=>list.append(element('li','',text)));showDialog('GRUPO 7 · APP DE DELIVERY','HU-G7-01 · Reclamo de un pedido',[story,list]);
});
$('show-team').addEventListener('click',()=>{const rows=[['Luis Angulo Ruiz','Product Owner'],['Lucely Rubi Mendoza Deza','Scrum Master'],['Leonardo Chavez','Developer · Frontend'],['Josue Santiago Laurente Ticona','Developer · Backend'],['Kevin Quispe Huaraca','Developer · QA']].map(([name,role])=>{const row=element('div','team-row');row.append(element('strong','',name),element('span','',role));return row;});showDialog('SCRUM TEAM · 5 INTEGRANTES','Nuestro equipo',rows);});
$('export-board').addEventListener('click',()=>{
  const date=new Intl.DateTimeFormat('es-CO',{dateStyle:'long',timeStyle:'short',timeZone:'America/Bogota'}).format(new Date());
  const lines=['# Ejecución del Sprint — Grupo 7','','App de delivery · HU-G7-01 · Sprint 1 (2 semanas)','Evidencia del tablero: '+date+' (Bogotá)','','Product Owner: Luis Angulo Ruiz','Scrum Master: Lucely Rubi Mendoza Deza','','Objetivo: registrar un reclamo de un pedido entregado en las últimas 48 horas, con evidencias y ticket único.',''];
  for(const [state,label]of Object.entries(labels)){lines.push('## '+label,'');tasks.filter(task=>statuses[task.id]===state).forEach(task=>lines.push('- '+task.id+': '+task.title+' — '+task.owner));lines.push('');}
  lines.push('Avances reportados del Daily: Frontend 80 %, Backend 75 %.','Estado inicial confirmado: 01 y 02 Done; 03 To Do; 04, 05 y 06 Doing.');
  const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/markdown;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='grupo7-ejecucion-sprint.md';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
render();
try{const response=await fetch('/api/board',{signal:AbortSignal.timeout(12000)});if(!response.ok)throw new Error('load');const data=await response.json();if(!changedWhileLoading&&isValid(data.statuses)){statuses=data.statuses;try{localStorage.setItem(storageKey,JSON.stringify(statuses));}catch{}render();}$('save-status').textContent='✓ Tablero sincronizado';}catch{$('save-status').textContent='Guardado en este navegador';}
