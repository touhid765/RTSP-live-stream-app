import React, {useState} from 'react';
import axios from 'axios';

export default function OverlayManager({onChange, overlays}){
  const [form, setForm] = useState({name:'', x:0, y:0, width:100, height:30, content:'', background:'rgba(0,0,0,0.4)', color:'#fff', visible:true});

  const save = async () => {
    await axios.post('/api/overlays', form);
    setForm({name:'', x:0, y:0, width:100, height:30, content:'', background:'rgba(0,0,0,0.4)', color:'#fff', visible:true});
    onChange();
  }

  const remove = async (id) => {
    await axios.delete('/api/overlays/' + id);
    onChange();
  }

  const update = async (id) => {
    const payload = { ...form };
    await axios.put('/api/overlays/' + id, payload);
    onChange();
  }

  return (
    <div>
      <h3>Overlay Manager</h3>
      <div style={{display:'flex', gap:10}}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <input placeholder="Content" value={form.content} onChange={e=>setForm({...form, content:e.target.value})}/>
        <input placeholder="X" type="number" value={form.x} onChange={e=>setForm({...form, x: Number(e.target.value)})} style={{width:60}}/>
        <input placeholder="Y" type="number" value={form.y} onChange={e=>setForm({...form, y: Number(e.target.value)})} style={{width:60}}/>
        <button onClick={save}>Add Overlay</button>
      </div>

      <div style={{marginTop:10}}>
        <h4>Existing</h4>
        {overlays.map(o=>(
          <div key={o._id} style={{display:'flex', gap:10, alignItems:'center'}}>
            <div style={{flex:1}}>{o.name} — {o.content}</div>
            <button onClick={()=>remove(o._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}