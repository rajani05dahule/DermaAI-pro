
export const processImage = (file: File | Blob): Promise<{ base64: string; preview: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Target 224x224 as requested
        canvas.width = 224;
        canvas.height = 224;
        
        if (ctx) {
          // Drawing with centering/cropping logic
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 224, 224);
          
          const preview = canvas.toDataURL('image/jpeg', 0.9);
          const base64 = preview.split(',')[1];
          resolve({ base64, preview });
        } else {
          reject(new Error("Canvas context failed"));
        }
      };
    };
    reader.onerror = (error) => reject(error);
  });
};
