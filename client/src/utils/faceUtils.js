import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';
let modelsLoaded = false;

// Function to load all the required models, but only once
export async function loadModels() {
  if (modelsLoaded) {
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
  
  if (!modelsLoaded) {
    console.error("Models not loaded yet. Attempting to load now...");
    await loadModels();
  }

  // blob (File object) থেকে একটি অস্থায়ী URL তৈরি করা হচ্ছে
  const url = URL.createObjectURL(blob);
  
  try {
    const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
    
    // fetchImage-কে এখন blob-এর পরিবর্তে অস্থায়ী URLটি দেওয়া হচ্ছে
    const image = await faceapi.fetchImage(url);
    
    const fullDesc = await faceapi
      .detectSingleFace(image, options)
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    return fullDesc;
  } catch (error) {
    console.error("Error in getFullFaceDescription:", error);
    return null;
  } finally {
    // মেমোরি লিক এড়ানোর জন্য অস্থায়ী URLটিকে রিলিজ করে দেওয়া হচ্ছে
    URL.revokeObjectURL(url);
  }
}