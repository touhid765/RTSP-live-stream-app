# User Documentation

## Running locally (development)

### Prerequisites
- Python 3.8+
- Node.js and npm
- MongoDB running locally or a connection string (set MONGO_URI)
- (Optional) a test RTSP source. You can use an IP camera or an RTSP test stream.

### Backend
1. cd backend
2. python -m venv venv
3. source venv/bin/activate   (on Windows: venv\Scripts\activate)
4. pip install -r requirements.txt
5. export MONGO_URI='mongodb://localhost:27017/rtsp_app'   (on Windows use set)
6. python app.py

### Frontend
1. cd frontend
2. npm install
3. npm start
4. Open http://localhost:3000 and point the RTSP field to your RTSP URL, click Play.

Notes:
- The MJPEG proxy reads frames using OpenCV. If your RTSP requires credentials, include them in the URL: rtsp://user:pass@ip:port/path
- For production, consider using ffmpeg to transcode to HLS or WebRTC for better compatibility and performance.