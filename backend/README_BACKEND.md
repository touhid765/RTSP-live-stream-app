# RTSP Live Stream App (Flask + React + MongoDB)

## Overview
This project demonstrates a minimal full-stack app that:
- Streams an RTSP video feed via a Flask MJPEG proxy (`/video_feed?url=RTSP_URL`)
- Provides CRUD endpoints for overlays stored in MongoDB
- Frontend in React showing the livestream (as an <img> MJPEG stream) and overlay management UI.

## Tech stack
- Python (Flask)
- MongoDB
- React (frontend)
- OpenCV (to read RTSP frames)