import React, { useState, useRef, useEffect, useCallback } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";

export default function TryOn({ variant }) {
  const [view, setView] = useState("3d");
  const [bodyModel, setBodyModel] = useState(null);
  const [poseModel, setPoseModel] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const render3DViewer = () => (
    <model-viewer
      src={variant.model3d}
      camera-controls
      auto-rotate
      ar
      ar-modes="scene-viewer quick-look webxr"
      style={{ width: "400px", height: "400px" }}
    />
  );

  /** ----------------------------- 
   * CAMERA 
   --------------------------------*/
  const loadCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        detectBody(); // start loop
      };
    } catch (err) {
      console.log("Camera error:", err);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ----------------------------- 
   * LOAD MODELS 
   --------------------------------*/
  const loadBodyPix = useCallback(async () => {
    const net = await bodyPix.load({
      architecture: "MobileNetV1",
      outputStride: 16,
      multiplier: 0.75,
    });
    setBodyModel(net);
  }, []);

  const loadPoseNet = useCallback(async () => {
    const pose = await posenet.load();
    setPoseModel(pose);
  }, []);

  /** ----------------------------- 
   * AR DETECTION LOOP
   --------------------------------*/
  const detectBody = async () => {
    if (!bodyModel || !poseModel || !videoRef.current) {
      requestAnimationFrame(detectBody);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 1. segment person
    await bodyModel.segmentPerson(video, {
      internalResolution: "medium",
      segmentationThreshold: 0.7,
    });

    // 2. pose detection
    const pose = await poseModel.estimateSinglePose(video, {
      flipHorizontal: false,
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw camera
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // extract keypoints
    const ls = pose.keypoints.find((k) => k.part === "leftShoulder");
    const rs = pose.keypoints.find((k) => k.part === "rightShoulder");
    const lh = pose.keypoints.find((k) => k.part === "leftHip");

    if (ls.score > 0.4 && rs.score > 0.4 && lh.score > 0.4) {
      const x = ls.position.x;
      const y = ls.position.y;
      const width = rs.position.x - ls.position.x;
      const height = (lh.position.y - ls.position.y) * 1.4;

      const img = new Image();
      img.src = variant.overlay;

      img.onload = () => ctx.drawImage(img, x, y, width, height);
    }

    requestAnimationFrame(detectBody);
  };

  /** ----------------------------- */
  useEffect(() => {
    if (view === "ar") {
      loadCamera();
      loadBodyPix();
      loadPoseNet(); // important
    }
  }, [view, loadCamera, loadBodyPix, loadPoseNet]);

  return (
    <div className="p-4 flex flex-col items-center space-y-3">
      <div className="flex space-x-2 mb-2">
        <button
          onClick={() => setView("3d")}
          className={`px-3 py-1 rounded ${
            view === "3d" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          3D View
        </button>

        <button
          onClick={() => setView("ar")}
          className={`px-3 py-1 rounded ${
            view === "ar" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          AR Try-On
        </button>
      </div>

      <div className="border rounded p-2">
        {view === "3d" && render3DViewer()}

        {view === "ar" && (
          <div className="relative">
            <video
              ref={videoRef}
              className="absolute opacity-0 pointer-events-none"
              width="640"
              height="480"
              playsInline
            />

            <canvas
              ref={canvasRef}
              className="rounded"
              style={{ width: "360px", height: "480px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
