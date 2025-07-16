// import React, { useState } from 'react';
// import axios from 'axios';
// import axiosRetry from 'axios-retry';
// import { Box, Button, CircularProgress, Alert, Typography } from '@mui/material';

// axiosRetry(axios, {
//   retries: 3,
//   retryDelay: (retryCount) => retryCount * 1000,
//   retryCondition: (error) => error.message.includes('Network Error'),
// });

// const FileUpload = ({ onReportGenerated, onError }) => {
//   const [files, setFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [analyzing, setAnalyzing] = useState(false);
//   const [pdfBlobs, setPdfBlobs] = useState({});
//   const [uploadSuccess, setUploadSuccess] = useState(false);
//   const [uploadedFileNames, setUploadedFileNames] = useState([]);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles(selectedFiles);
//     setUploadedFileNames(selectedFiles.map(file => file.name));
//     setUploadSuccess(false);
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (files.length === 0) {
//       onError('Please select at least one PDF file.');
//       return;
//     }

//     setUploading(true);
//     const formData = new FormData();
//     files.forEach((file) => formData.append('files', file));

//     try {
//       console.time('upload-files');
//       console.log('Sending request to:', 'http://127.0.0.1:8000/api/upload-files');
//       const uploadResponse = await axios.post('http://127.0.0.1:8000/api/upload-files', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         timeout: 60000,
//       });
//       console.log('Upload response:', {
//         data: uploadResponse.data,
//         status: uploadResponse.status,
//       });
//       console.timeEnd('upload-files');

//       if (uploadResponse.data.status !== 'success') {
//         throw new Error('File upload failed: ' + (uploadResponse.data.detail || 'Unknown error'));
//       }

//       setUploadSuccess(true);
//       onError(null);
//       files.forEach((file) => {
//         const blobUrl = URL.createObjectURL(file);
//         setPdfBlobs(prev => ({ ...prev, [file.name]: blobUrl }));
//       });
//     } catch (error) {
//       console.error('Upload Error:', {
//         message: error.message,
//         code: error.code,
//         response: error.response ? {
//           status: error.response.status,
//           data: error.response.data,
//           headers: error.response.headers,
//         } : null,
//         config: error.config ? {
//           url: error.config.url,
//           headers: error.config.headers,
//         } : null,
//       });
//       if (error.code === 'ECONNABORTED') {
//         onError('Upload timed out after 60s. Check if the backend server is running on http://127.0.0.1:8000.');
//       } else if (error.message.includes('Network Error')) {
//         onError('Network error: Unable to reach the backend. Ensure the server is running on http://127.0.0.1:8000.');
//       } else if (error.response?.data?.detail) {
//         onError(`Upload error: ${error.response.data.detail}`);
//       } else {
//         onError(`Error uploading files: ${error.message || 'Unknown error'}`);
//       }
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleAnalyze = async () => {
//     if (!uploadSuccess) {
//       onError('Please upload files first before analyzing.');
//       return;
//     }

//     setAnalyzing(true);
//     try {
//       console.time('analyze');
//       console.log('Sending request to:', 'http://127.0.0.1:8000/api/analyze');
//       const analyzeResponse = await axios.post('http://127.0.0.1:8000/api/analyze', {}, {
//         headers: {
//           'Accept': 'application/json',
//         },
//         timeout: 60000,
//       });
//       console.log('Analyze response:', {
//         data: analyzeResponse.data,
//         status: analyzeResponse.status,
//       });

//       if (analyzeResponse.data.status !== 'processing' || !analyzeResponse.data.task_id) {
//         throw new Error('Invalid analyze response: Expected task_id and status "processing".');
//       }

//       const taskId = analyzeResponse.data.task_id;
//       console.log('Task ID:', taskId);

//       let status = 'pending';
//       while (status === 'pending') {
//         await new Promise(resolve => setTimeout(resolve, 5000));
//         const statusResponse = await axios.get(`http://127.0.0.1:8000/api/status/${taskId}`, {
//           timeout: 60000,
//         });
//         console.log('Status response:', statusResponse.data);
//         status = statusResponse.data.status;

//         if (status === 'error') {
//           throw new Error('Analysis failed on backend. Check backend logs.');
//         }
//       }

//       console.log('Fetching result for task:', taskId);
//       const resultResponse = await axios.get(`http://127.0.0.1:8000/api/result/${taskId}`, {
//         timeout: 60000,
//       });
//       console.log('Result response:', {
//         data: resultResponse.data,
//         status: resultResponse.status,
//       });

//       const result = resultResponse.data;
//       if (result.status === 'error') {
//         throw new Error(`Analysis error: ${result.errors.join(', ')}`);
//       }

//       if (result.pdf_base64 && result.pdf_base64.length > 50_000_000) {
//         throw new Error('Response size too large. Try uploading smaller PDFs.');
//       }
//       if (!result.company_name || !result.business_overview) {
//         console.warn('Response missing expected fields:', result);
//         throw new Error('Incomplete response: Missing required fields.');
//       }

//       try {
//         console.log('Calling onReportGenerated with result:', {
//           company_name: result.company_name,
//           business_overview: result.business_overview.substring(0, 100) + '...',
//           quarterly_highlights: result.quarterly_highlights.substring(0, 100) + '...',
//           investment_thesis: result.investment_thesis.substring(0, 100) + '...',
//           key_thesis_points: result.key_thesis_points,
//           pdf_bytes: result.pdf_base64 ? result.pdf_base64.substring(0, 50) + '...' : null,
//           uploadedFileNames,
//         });
//         const report = {
//           ...result,
//           task_id: taskId,
//           uploadedFileNames,
//           pdfBlobs,
//         };
        
//         onReportGenerated(report);
//         onError(null);
//       } catch (error) {
//         console.error('Error in onReportGenerated:', {
//           message: error.message,
//           stack: error.stack,
//         });
//         onError('Error rendering analysis result. Check for invalid hook usage in the report display component.');
//       }
//     } catch (error) {
//       console.error('Analyze Error:', {
//         message: error.message,
//         code: error.code,
//         response: error.response ? {
//           status: error.response.status,
//           data: error.response.data,
//           headers: error.response.headers,
//         } : null,
//         config: error.config ? {
//           url: error.config.url,
//           headers: error.config.headers,
//         } : null,
//       });
//       if (error.code === 'ECONNABORTED') {
//         onError('Analysis timed out. Check backend logs for delays or try a smaller file.');
//       } else if (error.message.includes('Network Error')) {
//         onError('Network error: Unable to reach the backend. Ensure the server is running on http://127.0.0.1:8000.');
//       } else if (error.response?.data?.detail) {
//         onError(`Analysis error: ${error.response.data.detail}`);
//       } else {
//         onError(`Error analyzing files: ${error.message || 'Unknown error'}`);
//       }
//     } finally {
//       setAnalyzing(false);
//     }
//   };

//   return (
//     <Box sx={{ p: 3, mb: 3, bgcolor: '#27292D' }}>
//       <Typography variant="h3" gutterBottom color="text.primary">
//         Upload PDF Files
//       </Typography>
//       <form onSubmit={handleUpload}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
//           <input
//             type="file"
//             accept="application/pdf"
//             multiple
//             onChange={handleFileChange}
//             style={{ display: 'block', color: '#b0bec5' }}
//           />
//         </Box>
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           disabled={uploading || files.length === 0}
//           startIcon={uploading ? <CircularProgress size={20} /> : null}
//           sx={{ mr: 2 }}
//         >
//           {uploading ? 'Uploading...' : 'Upload Files'}
//         </Button>
//         <Button
//           variant="contained"
//           color="secondary"
//           onClick={handleAnalyze}
//           disabled={analyzing || !uploadSuccess}
//           startIcon={analyzing ? <CircularProgress size={20} /> : null}
//         >
//           {analyzing ? 'Analyzing...' : 'Analyze Files'}
//         </Button>
//       </form>
//     </Box>
//   );
// };

// export default FileUpload;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




import React, { useState } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => error.message.includes('Network Error'),
});

const FileUpload = ({ onReportGenerated, onError, navigate, showAnalyzeButton = false, existingFileNames = [] }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [pdfBlobs, setPdfBlobs] = useState({});

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setUploadedFileNames(selectedFiles.map(file => file.name));
    setUploadSuccess(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      onError('Please select at least one PDF file.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('existing_files', JSON.stringify(existingFileNames));

    try {
      console.time('upload-files');
      console.log('Sending request to:', 'http://127.0.0.1:8000/api/upload-files', { existing_files: existingFileNames });
      const uploadResponse = await axios.post('http://127.0.0.1:8000/api/upload-files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });
      console.log('Upload response:', {
        data: uploadResponse.data,
        status: uploadResponse.status,
      });
      console.timeEnd('upload-files');

      if (uploadResponse.data.status !== 'success') {
        throw new Error('File upload failed: ' + (uploadResponse.data.detail || 'Unknown error'));
      }

      setUploadSuccess(true);
      onError(null);
      const newPdfBlobs = {};
      files.forEach((file) => {
        const blobUrl = URL.createObjectURL(file);
        newPdfBlobs[file.name] = blobUrl;
      });
      setPdfBlobs(newPdfBlobs);

      // Trigger onReportGenerated with uploaded file names and pdfBlobs
      onReportGenerated({
        uploadedFileNames: [...new Set([...existingFileNames, ...uploadedFileNames])],
        pdfBlobs: newPdfBlobs,
      });
      // navigate('/main');
    } catch (error) {
      console.error('Upload Error:', {
        message: error.message,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        } : null,
        config: error.config ? {
          url: error.config.url,
          headers: error.config.headers,
        } : null,
      });
      if (error.code === 'ECONNABORTED') {
        onError('Upload timed out after 60s. Check if the backend server is running on http://127.0.0.1:8000.');
      } else if (error.message.includes('Network Error')) {
        onError('Network error: Unable to reach the backend. Ensure the server is running on http://127.0.0.1:8000.');
      } else if (error.response?.data?.detail) {
        onError(`Upload error: ${error.response.data.detail}`);
      } else {
        onError(`Error uploading files: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 3, mb: 3, bgcolor: '#27292D' }}>
      <Typography variant="h3" gutterBottom color="text.primary">
        Upload PDF Files
      </Typography>
      <form onSubmit={handleUpload}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            style={{ display: 'block', color: '#b0bec5' }}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={uploading || files.length === 0}
          startIcon={uploading ? <CircularProgress size={20} /> : null}
          sx={{ mr: 2 }}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </form>
    </Box>
  );
};

export default FileUpload;


