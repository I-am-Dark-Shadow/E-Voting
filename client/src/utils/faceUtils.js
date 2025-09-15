import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';

// Function to load all the required models
export async function loadModels() {
  try {
    console.log("Loading Face-API models...");
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    ]);
    console.log("Face-API models loaded successfully");
  } catch (error) {
    console.error("Error loading face-api models:", error);
  }
}

// Function to detect a single face and compute its descriptor
export async function getFullFaceDescription(blob, inputSize = 512) {
  if (!blob) {
    return null;
  }
  
  const scoreThreshold = 0.5;
  const options = new faceapi.SsdMobilenetv1Options({
    minConfidence: scoreThreshold,
  });

  // Create a temporary URL from the blob/file
  const url = URL.createObjectURL(blob);
  
  try {
    // Create an HTML image element from the URL
    const img = await faceapi.fetchImage(url);
    
    // Detect face with landmarks and descriptor
    const fullDesc = await faceapi
      .detectSingleFace(img, options)
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    return fullDesc;
  } finally {
    // Free up memory by revoking the temporary URL
    URL.revokeObjectURL(url);
  }
}