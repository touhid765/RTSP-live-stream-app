from flask import Flask, request, jsonify, Response, send_from_directory
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import cv2
import threading
import time
import os

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
# MongoDB config - default assumes localhost:27017 and database 'rtsp_app'
app.config["MONGO_URI"] = os.environ.get("MONGO_URI", "mongodb://localhost:27017/rtsp_app")
mongo = PyMongo(app)

# Overlays collection: stores overlays with fields: name, x, y, width, height, content, visible
@app.route('/api/overlays', methods=['POST'])
def create_overlay():
    data = request.json
    res = mongo.db.overlays.insert_one(data)
    return jsonify({"id": str(res.inserted_id)}), 201

@app.route('/api/overlays', methods=['GET'])
def list_overlays():
    overlays = []
    for o in mongo.db.overlays.find():
        o["_id"] = str(o["_id"])
        overlays.append(o)
    return jsonify(overlays)

@app.route('/api/overlays/<id>', methods=['PUT'])
def update_overlay(id):
    data = request.json
    mongo.db.overlays.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"status":"updated"})

@app.route('/api/overlays/<id>', methods=['DELETE'])
def delete_overlay(id):
    mongo.db.overlays.delete_one({"_id": ObjectId(id)})
    return jsonify({"status":"deleted"})

# Simple MJPEG streamer using OpenCV that proxies an RTSP feed and returns multipart JPEG frames.
def mjpeg_stream(rtsp_url):
    cap = cv2.VideoCapture(rtsp_url)
    if not cap.isOpened():
        # Return a single-frame error image
        import numpy as np
        img = 255 * np.ones((240,320,3), dtype='uint8')
        _, jpg = cv2.imencode('.jpg', img)
        frame = jpg.tobytes()
        while True:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            time.sleep(0.5)
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            # sleep a bit and try again
            time.sleep(0.1)
            continue
        _, jpg = cv2.imencode('.jpg', frame)
        frame_bytes = jpg.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    cap.release()

@app.route('/video_feed')
def video_feed():
    # Example usage: /video_feed?url=rtsp://username:pass@ip:554/stream
    rtsp_url = request.args.get('url')
    if not rtsp_url:
        return "Missing 'url' query parameter", 400
    return Response(mjpeg_stream(rtsp_url), mimetype='multipart/x-mixed-replace; boundary=frame')

# Serve frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)