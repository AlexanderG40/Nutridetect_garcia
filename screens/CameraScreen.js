import { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from 'expo-image-manipulator';
import { performOCR } from "../utils/ocrAPI";

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>We need camera permission</Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function compressImage(uri) {
    try {
      // Compress and resize the image
      const manipulatedImage = await ImageManipulator.manipulate(
        uri,
        [
          { resize: { width: 1000 } }, // Resize to max width of 1200px
        ],
        {
          compress: 0.6, // 60% quality
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );
      
      return manipulatedImage;
    } catch (error) {
      console.error('Image compression error:', error);
      throw error;
    }
  }

  async function takePicture() {
    if (isTakingPhoto || !cameraRef.current) return;

    try {
      setIsTakingPhoto(true);

      // Take picture without base64 first (faster)
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      // Show processing UI
      setIsProcessing(true);

      // Compress the image and get base64
      const compressedImage = await compressImage(photo.uri);

      // Perform OCR with compressed image
      const ocrResult = await performOCR(compressedImage.base64);

      setIsProcessing(false);

      if (ocrResult.success) {
        navigation.navigate("Result", {
          text: ocrResult.text,
          photoUri: photo.uri, // Use original URI for display
        });
      } else {
        const errorMessage = typeof ocrResult.error === 'string' 
          ? ocrResult.error 
          : "Could not read text. Try again with better lighting.";
        
        Alert.alert(
          "OCR Failed",
          errorMessage,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      const errorMessage = typeof error === 'string' 
        ? error 
        : (error?.message || "Failed to process image. Please try again.");
      
      Alert.alert("Error", errorMessage);
      console.error(error);
    } finally {
      setIsTakingPhoto(false);
      setIsProcessing(false);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      
      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.frameContainer}>
          <View style={styles.frame} />

          <Text style={styles.instruction}>
            Position the ingredients label within the frame
          </Text>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.captureButton,
              (isTakingPhoto || isProcessing) && styles.captureButtonDisabled,
            ]}
            onPress={takePicture}
            disabled={isTakingPhoto || isProcessing}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </View>

      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.processingText}>Analyzing image...</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#334155",
  },
  permissionButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  topBar: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "300",
  },
  frameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  frame: {
    width: "90%",
    height: 300,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  instruction: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
    borderRadius: 8,
  },
  bottomBar: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#3b82f6",
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3b82f6",
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingCard: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    minWidth: 200,
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#334155",
    fontWeight: "600",
  },
});
