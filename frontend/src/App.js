import React, {useState, useEffect} from 'react';
import axios from 'axios';
import OverlayManager from './components/OverlayManager';

export default function App(){
  const [rtspUrl, setRtspUrl] = useState('');
  const [playing, setPlaying] = useState(false);
  const [overlays, setOverlays] = useState([]);

  useEffect(()=> {
    fetchOverlays();
  },[]);

  const fetchOverlays = async () => {
    try {
      const res = await axios.get('/api/overlays');
      setOverlays(res.data);
    } catch(e){
      console.error(e);
    }
  }

  const togglePlay = () => setPlaying(p => !p);

  return (
    <div style={{fontFamily:'Arial, sans-serif', padding:20}}>
      <h1>Full Stack RTSP Live Stream</h1>
      <div style={{marginBottom:10}}>
        <input placeholder="Enter RTSP URL (e.g. rtsp://...)" value={rtspUrl} onChange={e=>setRtspUrl(e.target.value)} style={{width:'70%'}}/>
        <button onClick={togglePlay} style={{marginLeft:10}}>{playing ? 'Stop' : 'Play'}</button>
      </div>

      <div style={{position:'relative', width: '640px', height:'360px', background:'#000'}}>
        {playing && rtspUrl ? (
          <img src={`/video_feed?url=${encodeURIComponent(rtspUrl)}`} alt="video stream" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
        ) : (
          <div style={{color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', height:'100%'}}>Video is stopped</div>
        )}
        {/* overlays */}
        {overlays.map(o => (
          <div key={o._id}
               style={{
                 position:'absolute',
                 left: o.x || 0,
                 top: o.y || 0,
                 width: o.width || 100,
                 height: o.height || 30,
                 pointerEvents: 'none',
                 background: o.background || 'transparent',
                 color: o.color || '#fff',
                 display: o.visible === False ? 'none' : 'block'
               }}>
            {o.content || o.name || ''}
          </div>
        ))}
      </div>

      <hr/>
      <OverlayManager onChange={fetchOverlays} overlays={overlays}/>
    </div>
  );
}