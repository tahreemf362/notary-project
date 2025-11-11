import * as faceapi from "face-api.js";
import { Canvas, Image, ImageData, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// face-api ko canvas ke sath link karna
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Models load karna (once)
const modelPath = path.join(__dirname, "models");

async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
}

await loadModels();

export async function compareFaces(files) {
  try {
    // CNIC face image
    const cnicImage = await loadImage(files.cnic[0].path);
    const cnicDesc = await faceapi
      .detectSingleFace(cnicImage)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!cnicDesc) return { status: "invalid", message: "No face found on CNIC" };

    // Face images (3)
    let matchScores = [];
    for (let key of ["face1", "face2", "face3"]) {
      const img = await loadImage(files[key][0].path);
      const desc = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (desc) {
        const distance = faceapi.euclideanDistance(
          cnicDesc.descriptor,
          desc.descriptor
        );
        const matchPercent = Math.round((1 - distance) * 100);
        matchScores.push(matchPercent);
      }
    }

    const avgMatch = matchScores.reduce((a, b) => a + b, 0) / matchScores.length;

    if (avgMatch >= 80) {
      return { status: "verified", match: avgMatch.toFixed(2) };
    } else {
      return { status: "invalid", match: avgMatch.toFixed(2) };
    }
  } catch (err) {
    console.error(err);
    return { status: "error", message: "Error during face comparison" };
  } finally {
    // temporary uploads delete karne ke liye
    Object.values(files).forEach((arr) => fs.unlinkSync(arr[0].path));
  }
}
