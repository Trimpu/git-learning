// Get DOM elements
const imageInput = document.getElementById('imageInput');
const originalCanvas = document.getElementById('originalCanvas');
const negativeCanvas = document.getElementById('negativeCanvas');
const processBtn = document.getElementById('processBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

let uploadedImage = null;

// Handle image upload
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            uploadedImage = new Image();
            uploadedImage.onload = function() {
                displayOriginalImage();
                processBtn.disabled = false;
            };
            uploadedImage.src = event.target.result;
        };
        
        reader.readAsDataURL(file);
    }
});

// Display original image on canvas
function displayOriginalImage() {
    const ctx = originalCanvas.getContext('2d');
    
    // Set canvas dimensions to match image
    originalCanvas.width = uploadedImage.width;
    originalCanvas.height = uploadedImage.height;
    
    // Draw the original image
    ctx.drawImage(uploadedImage, 0, 0);
}

// Generate negative image
processBtn.addEventListener('click', function() {
    if (!uploadedImage) return;
    
    const ctx = originalCanvas.getContext('2d');
    
    // Set negative canvas dimensions
    negativeCanvas.width = uploadedImage.width;
    negativeCanvas.height = uploadedImage.height;
    
    // Get image data from original canvas
    const imageData = ctx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    const pixels = imageData.data;
    
    // Process each pixel
    // pixels array structure: [R, G, B, A, R, G, B, A, ...]
    for (let i = 0; i < pixels.length; i += 4) {
        // Extract RGB values
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];
        // Alpha channel at pixels[i + 3] - keep unchanged
        
        // Calculate negative by subtracting from 255
        pixels[i] = 255 - red;       // Red
        pixels[i + 1] = 255 - green; // Green
        pixels[i + 2] = 255 - blue;  // Blue
        // pixels[i + 3] stays the same (Alpha)
    }
    
    // Draw the negative image on the negative canvas
    const negativeCtx = negativeCanvas.getContext('2d');
    negativeCtx.putImageData(imageData, 0, 0);
    
    // Enable download button
    downloadBtn.disabled = false;
});

// Download negative image
downloadBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'negative-image.png';
    link.href = negativeCanvas.toDataURL('image/png');
    link.click();
});

// Reset everything
resetBtn.addEventListener('click', function() {
    // Clear canvases
    const ctxOriginal = originalCanvas.getContext('2d');
    const ctxNegative = negativeCanvas.getContext('2d');
    
    ctxOriginal.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
    ctxNegative.clearRect(0, 0, negativeCanvas.width, negativeCanvas.height);
    
    // Reset dimensions
    originalCanvas.width = 0;
    originalCanvas.height = 0;
    negativeCanvas.width = 0;
    negativeCanvas.height = 0;
    
    // Reset variables and buttons
    uploadedImage = null;
    imageInput.value = '';
    processBtn.disabled = true;
    downloadBtn.disabled = true;
});
