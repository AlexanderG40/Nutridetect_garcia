const OCR_API_KEY = 'K88607277388957'; // Got the key from ocr.space
const OCR_API_URL = 'https://api.ocr.space/parse/image';

export async function performOCR(imageUri) {
  try {
    const formData = new FormData();

    // Add the image as base64
    formData.append('base64Image', `data:image/jpeg;base64,${imageUri}`);
    formData.append('apikey', OCR_API_KEY);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2');

    const response = await fetch(OCR_API_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.OCRExitCode === 1) {
      const extractedText = result.ParsedResults[0].ParsedText;
      return {
        success: true,
        text: extractedText,
      };
    } else {
      // Ensure error is always a string
      let errorMessage = 'OCR failed';
      
      if (result.ErrorMessage) {
        if (Array.isArray(result.ErrorMessage)) {
          errorMessage = result.ErrorMessage.join(', ');
        } else if (typeof result.ErrorMessage === 'object') {
          errorMessage = JSON.stringify(result.ErrorMessage);
        } else {
          errorMessage = String(result.ErrorMessage);
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      success: false,
      error: 'Failed to process image. Please try again.',
    };
  }
}

//  File upload method if base64 fails
export async function performOCRWithFile(imageUri) {
  try {
    const formData = new FormData();

    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
    formData.append('apikey', OCR_API_KEY);
    formData.append('language', 'eng');
    formData.append('OCREngine', '2');

    const response = await fetch(OCR_API_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.OCRExitCode === 1) {
      return {
        success: true,
        text: result.ParsedResults[0].ParsedText,
      };
    } else {
      // Ensure error is always a string
      let errorMessage = 'OCR failed';
      
      if (result.ErrorMessage) {
        if (Array.isArray(result.ErrorMessage)) {
          errorMessage = result.ErrorMessage.join(', ');
        } else if (typeof result.ErrorMessage === 'object') {
          errorMessage = JSON.stringify(result.ErrorMessage);
        } else {
          errorMessage = String(result.ErrorMessage);
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      success: false,
      error: 'Failed to process image',
    };
  }
}

// URL-based OCR 
export async function performOCRFromUrl(imageUrl) {
  try {
    const response = await fetch(
      `${OCR_API_URL}?apikey=${OCR_API_KEY}&url=${encodeURIComponent(imageUrl)}&language=eng&OCREngine=2`
    );

    const result = await response.json();

    if (result.OCRExitCode === 1) {
      return {
        success: true,
        text: result.ParsedResults[0].ParsedText,
      };
    } else {
      // Ensure error is always a string
      let errorMessage = 'OCR failed';
      
      if (result.ErrorMessage) {
        if (Array.isArray(result.ErrorMessage)) {
          errorMessage = result.ErrorMessage.join(', ');
        } else if (typeof result.ErrorMessage === 'object') {
          errorMessage = JSON.stringify(result.ErrorMessage);
        } else {
          errorMessage = String(result.ErrorMessage);
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      success: false,
      error: 'Failed to process image',
    };
  }
}