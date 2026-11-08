import test from 'node:test';
import assert from 'node:assert/strict';
import {validStatuses} from '../api/board.js';
test('el servidor acepta únicamente seis tareas con estados conocidos',()=>{
  const board={'01':'done','02':'done','03':'todo','04':'doing','05':'doing','06':'todo'};
  assert.equal(validStatuses(board),true);
  assert.equal(Boolean(validStatuses({...board,'07':'done'})),false);
  assert.equal(Boolean(validStatuses({...board,'04':'desconocido'})),false);
  const missing={...board};delete missing['06'];assert.equal(Boolean(validStatuses(missing)),false);
  assert.equal(Boolean(validStatuses(['todo','doing','done'])),false);
  assert.equal(Boolean(validStatuses(null)),false);
});
