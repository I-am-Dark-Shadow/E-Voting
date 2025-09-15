import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';
let modelsLoaded = false;

// Function to load all the required models, but only once
export async function loadModels() {
  if (modelsLoaded) {
    console.log("Models are already loaded.");
    return;
  }
  try {
    console.log("Loading Face-API models...");
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
    console.log("Face-API models loaded successfully");
  } catch (error) {
    console.error("Error loading face-api models:", error);
  }
}

// Function to detect a single face and compute its descriptor
export async function getFullFaceDescription(blob) {
  if (!blob) {
    return null;
  }
  
  // Ensure models are loaded before proceeding
  if (!modelsLoaded) {
    console.error("Models not loaded yet. Call loadModels() first.");
    await loadModels(); // Attempt to load them again if not loaded
  }

  const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });

  try {
    const image = await faceapi.fetchImage(blob);
    
    const fullDesc = await faceapi
      .detectSingleFace(image, options)
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    return fullDesc;
  } catch (error) {
    console.error("Error in getFullFaceDescription:", error);
    return null;
  }
}