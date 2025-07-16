// import React, { useState, useEffect } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';
// import axios from 'axios';
// const InlinePDFViewer = ({ file, page, blobUrl }) => {

// // Set pdf.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

// const InlinePDFViewer = ({ file, page }) => {
//   const [numPages, setNumPages] = useState(null);
//   const [error, setError] = useState(null);
//   const [pdfData, setPdfData] = useState(null);

//   useEffect(() => {
//     const fetchPDF = async () => {
//       if (!file || !page) {
//         setError('Invalid file or page number');
//         console.error('Invalid props:', { file, page });
//         return;
//       }

//       setError(null);
//       console.log(`Fetching PDF for file: ${file}, page: ${page}`);
//       try {
//         const response = await axios.get(`/api/get-pdf/${encodeURIComponent(file)}`, {

//           responseType: 'arraybuffer', // Expect binary PDF data
//           timeout: 60000, // 60 seconds
//         });
//         console.log('PDF fetch response:', {
//           status: response.status,
//           headers: response.headers,
//           dataLength: response.data.byteLength,
//           contentType: response.headers['content-type'],
//         });

//         // Verify Content-Type
//         if (response.headers['content-type'] !== 'application/pdf') {
//           throw new Error(`Invalid Content-Type: ${response.headers['content-type']}`);
//         }

//         // Convert ArrayBuffer to Blob
//         const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
//         const pdfUrl = URL.createObjectURL(pdfBlob);
//         setPdfData(pdfUrl);
//       } catch (error) {
//         const errorDetails = {
//           message: error.message,
//           code: error.code,
//           response: error.response
//             ? {
//                 status: error.response.status,
//                 data: error.response.data ? new TextDecoder().decode(error.response.data) : null,
//                 headers: error.response.headers,
//               }
//             : null,
//         };
//         console.error('PDF fetch error:', errorDetails);
//         setError(
//           `Failed to fetch PDF: ${error.message}${error.response ? ` (Status: ${error.response.status})` : ''}`
//         );
//       }
//     };

//     fetchPDF();

//     // Cleanup Blob URL
//     return () => {
//       if (pdfData) {
//         URL.revokeObjectURL(pdfData);
//       }
//     };
//   }, [file, page, pdfData]);

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//     setError(null);
//     console.log(`PDF loaded successfully: ${file}, ${numPages} pages`);
//   };

//   const onDocumentLoadError = (error) => {
//     console.error(`PDF render error: ${error.message}`);
//     setError(`Failed to render PDF: ${error.message}`);
//   };

//   return (
//     <div>
//       {error && <div style={{ color: 'red' }}>{error}</div>}
//       {pdfData && (
//         <Document
//           file={pdfData}
//           onLoadSuccess={onDocumentLoadSuccess}
//           onLoadError={onDocumentLoadError}
//         >
//           <Page pageNumber={page} />
//         </Document>
//       )}
//       {numPages && (
//         <p>
//           Page {page} of {numPages}
//         </p>
//       )}
//     </div>
//   );
// };

// export default InlinePDFViewer;


////////////////////////////////////////localstroage////////////////////////////////////////////////////////////////////////////

import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf'; // ✅ Fix this import
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const InlinePDFViewer = ({ file, page, blobUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null);
    console.log(`PDF loaded successfully: ${file}, ${numPages} pages`);
  };

  const onDocumentLoadError = (error) => {
    console.error(`PDF render error: ${error.message}`);
    setError(`Failed to render PDF: ${error.message}`);
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {blobUrl && (
        <Document
          file={blobUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
        >
          <Page pageNumber={page} />
        </Document>
      )}
      {numPages && (
        <p>
          Page {page} of {numPages}
        </p>
      )}
    </div>
  );
};

export default InlinePDFViewer;


