// pages/index.js
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function ImageToPdfConverter() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please select a valid image file');
      setSelectedFile(null);
    }
  };

  const convertToPdf = async () => {
    if (!selectedFile) return;

    try {
      setConverting(true);
      setError(null);

      // Read the image file
      const imageBytes = await readFileAsArrayBuffer(selectedFile);
      
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Add a new page with the image dimensions
      const img = await createImageObject(pdfDoc, imageBytes, selectedFile.type);
      const page = pdfDoc.addPage([img.width, img.height]);
      
      // Draw the image on the page
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: img.width,
        height: img.height,
      });

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      downloadPdf(pdfBytes, selectedFile.name);

    } catch (err) {
      console.error('Conversion error:', err);
      setError('Error converting image to PDF: ' + err.message);
    } finally {
      setConverting(false);
    }
  };

  // Helper function to read file as ArrayBuffer
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // Helper function to create the appropriate image object based on file type
  const createImageObject = async (pdfDoc, imageBytes, fileType) => {
    if (fileType === 'image/jpeg') {
      return await pdfDoc.embedJpg(imageBytes);
    } else if (fileType === 'image/png') {
      return await pdfDoc.embedPng(imageBytes);
    } else {
      throw new Error('Unsupported image format');
    }
  };

  // Helper function to download the PDF
  const downloadPdf = (pdfBytes, originalFileName) => {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = originalFileName.replace(/\.[^/.]+$/, '') + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Image to PDF Converter
        </h1>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full text-sm text-gray-500 
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {selectedFile && (
            <div className="text-sm text-gray-600">
              Selected: {selectedFile.name}
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={convertToPdf}
            disabled={!selectedFile || converting}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${!selectedFile || converting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            {converting ? 'Converting...' : 'Convert to PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}