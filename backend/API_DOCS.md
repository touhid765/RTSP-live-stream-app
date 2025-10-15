# API Documentation

## Overlays
- POST /api/overlays
  - Body: JSON { name, x, y, width, height, content, background, color, visible }
  - Response: { id }

- GET /api/overlays
  - Response: [ { _id, name, x, y, width, height, content, ... } ]

- PUT /api/overlays/<id>
  - Body: JSON partial fields to update
  - Response: { status: "updated" }

- DELETE /api/overlays/<id>
  - Response: { status: "deleted" }

## Video stream
- GET /video_feed?url=<RTSP_URL>
  - Returns multipart/x-mixed-replace MJPEG stream that browsers can display via <img> tag.