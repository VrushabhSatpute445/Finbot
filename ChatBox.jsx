// import React, { useState } from 'react';
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Divider,
//   Stack
// } from '@mui/material';
// import axios from 'axios';

// const ChatBox = ({ sessionId, fileNames }) => {
//   const [query, setQuery] = useState('');
//   const [messages, setMessages] = useState([]);

//   const handleSend = async () => {
//     if (!query.trim()) return;

//     const updatedMessages = [...messages, { role: 'user', content: query }];
//     setMessages(updatedMessages);
//     setQuery('');

//     try {
//       const response = await axios.post('http://127.0.0.1:8000/api/chat', {
//         session_id: sessionId,
//         files: fileNames,
//         query: query,
//         history: JSON.stringify(updatedMessages)
//       });

//       const assistantMessage = {
//         role: 'assistant',
//         content: response.data.response
//       };

//       setMessages([...updatedMessages, assistantMessage]);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to send message.');
//     }
//   };

//   return (
//     <Box sx={{ p: 3, mt: 6, bgcolor: '#27292D' }}>
//       <Typography variant="h5" gutterBottom color="text.primary">
//         💬 Chat with the Report
//       </Typography>

//       <Divider sx={{ mb: 2, bgcolor: '#424242' }} />

//       <Box
//         sx={{
//           maxHeight: 300,
//           overflowY: 'auto',
//           mb: 3,
//           px: 2,
//           py: 1,
//           backgroundColor: '#f9f9f9',
//           borderRadius: 2,
//           border: '1px solid #ccc'
//         }}
//       >
//         {messages.map((msg, idx) => (
//           <Box
//             key={idx}
//             sx={{
//               mb: 1.5,
//               textAlign: msg.role === 'user' ? 'right' : 'left'
//             }}
//           >
//             <Typography
//               variant="body2"
//               sx={{
//                 display: 'inline-block',
//                 px: 2,
//                 py: 1,
//                 borderRadius: 2,
//                 backgroundColor: msg.role === 'user' ? '#1976d2' : '#e0e0e0',
//                 color: msg.role === 'user' ? 'white' : 'black',
//                 maxWidth: '80%'
//               }}
//               dangerouslySetInnerHTML={{ __html: msg.content }}
//             />
//           </Box>
//         ))}
//       </Box>

//       <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//         <TextField
//           fullWidth
//           label="Ask a question"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//           sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
//         />
//         <Button variant="contained" onClick={handleSend}>
//           Send
//         </Button>
//       </Stack>
//     </Box>
//   );
// };

// export default ChatBox;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// import React, { useState, useEffect, useRef } from 'react';
// import { Box, TextField, Button, Typography, Divider, Stack, CircularProgress } from '@mui/material';
// import axios from 'axios';

// const ChatBox = ({ sessionId, fileNames }) => {
//   const [query, setQuery] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Scroll to the bottom of the chat when new messages are added
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSend = async () => {
//     if (!query.trim() || isLoading) return;

//     const updatedMessages = [...messages, { role: 'user', content: query }];
//     setMessages(updatedMessages);
//     setQuery('');
//     setIsLoading(true);

//     try {
//       const response = await axios.post('http://127.0.0.1:8000/api/chat', {
//         session_id: sessionId,
//         files: fileNames,
//         query: query,
//         history: JSON.stringify(updatedMessages)
//       });

//       const assistantMessage = {
//         role: 'assistant',
//         content: response.data.response || 'No response received'
//       };

//       setMessages([...updatedMessages, assistantMessage]);
//     } catch (err) {
//       console.error('Chat error:', err);
//       setMessages([...updatedMessages, { role: 'assistant', content: 'Failed to send message.' }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         height: '100%',
//         bgcolor: '#27292D',
//       }}
//     >
//       {/* Static Header */}
//       <Box sx={{ p: 2 }}>
//         <Typography variant="h3" color="text.primary" sx={{ mb: 2 }}>
//           💬 Chat with the Report
//         </Typography>
//         <Divider sx={{ bgcolor: '#424242' }} />
//       </Box>
//       {/* Scrollable Chat Messages */}
//       <Box
//         sx={{
//           flex: 1,
//           overflowY: 'auto',
//           px: 2,
//           py: 1,
//           '&::-webkit-scrollbar': { width: '8px' },
//           '&::-webkit-scrollbar-thumb': { backgroundColor: '#424242', borderRadius: '4px' },
//           '&::-webkit-scrollbar-track': { backgroundColor: '#27292D' },
//           scrollbarWidth: 'thin',
//           scrollbarColor: '#424242 #27292D',
//         }}
//       >
//         {messages.map((msg, idx) => (
//           <Box
//             key={idx}
//             sx={{
//               display: 'flex',
//               justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
//               mb: 1.5,
//             }}
//           >
//             <Box
//               sx={{
//                 maxWidth: '70%',
//                 p: 1.5,
//                 borderRadius: 3,
//                 bgcolor: msg.role === 'user' ? '#42a5f5' : '#424242',
//                 color: '#ffffff',
//                 wordBreak: 'break-word',
//               }}
//             >
//               <Typography
//                 variant="body1"
//                 dangerouslySetInnerHTML={{ __html: msg.content }}
//               />
//             </Box>
//           </Box>
//         ))}
//         {isLoading && (
//           <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1.5 }}>
//             <CircularProgress size={24} sx={{ color: '#b0bec5' }} />
//           </Box>
//         )}
//         <div ref={messagesEndRef} />
//       </Box>
//       {/* Static Input and Button */}
//       <Box sx={{ p: 2 }}>
//         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//           <TextField
//             fullWidth
//             label="Ask a question"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyPress={handleKeyPress}
//             variant="outlined"
//             disabled={isLoading}
//             sx={{
//               bgcolor: 'background.paper',
//               borderRadius: 3,
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 3,
//                 color: '#ffffff',
//                 '& fieldset': { borderColor: '#424242' },
//                 '&:hover fieldset': { borderColor: '#b0bec5' },
//                 '&.Mui-focused fieldset': { borderColor: '#42a5f5' },
//                 '&.Mui-disabled fieldset': { borderColor: '#424242' },
//               },
//               '& .MuiInputBase-input': { color: '#ffffff' },
//               '& .MuiInputLabel-root': { color: '#b0bec5' },
//               '& .MuiInputLabel-root.Mui-focused': { color: '#42a5f5' },
//               '& .MuiInputLabel-root.Mui-disabled': { color: '#b0bec5' },
//             }}
//           />
//           <Button
//             variant="contained"
//             onClick={handleSend}
//             disabled={isLoading || !query.trim()}
//             sx={{
//               borderRadius: 3,
//               bgcolor: '#42a5f5',
//               '&:hover': { bgcolor: '#1e88e5' },
//               '&.Mui-disabled': { bgcolor: '#42a5f5', opacity: 0.5 },
//               textTransform: 'none',
//               height: '40px',
//             }}
//           >
//             Send
//           </Button>
//         </Stack>
//       </Box>
//     </Box>
//   );
// };

// export default ChatBox;


////////////////////////////////////////////////////////////////GROK( friday )//////////////////////////////////////////////////////////////////////////


import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Divider, Stack, CircularProgress, Tooltip } from '@mui/material';
import axios from 'axios';

const ChatBox = ({ sessionId, fileNames, selectedFile, pdfBlobs, onCitationClick }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const parseCitations = (text) => {
    if (!text || typeof text !== "string") return text;
  
    // Clean unnecessary tags except citation markers
    let cleanedText = text
      .replace(/<sup><span[^>]*>\[(\d+)\][\s\S]*?<\/span><\/sup>/g, "[$1]")
      .replace(/<\/?(div|span|strong|br|p)[^>]*>/g, "");
  
    const citationRegex = /<sup><span class='citation'[^>]*data-source='([^']+)'[^>]*data-page='([^']+)'[^>]*data-context='([^']*)'[^>]*>\[(\d+)\](?:<span class='citation-card'>.*?<\/span>)?<\/span><\/sup>/g;
  
    let elements = [];
    let lastIndex = 0;
    let match;
  
    while ((match = citationRegex.exec(text)) !== null) {
      const [fullMatch, sourceFile, pageNum, context, citationNumber] = match;
      const startIndex = match.index;
  
      if (startIndex > lastIndex) {
        elements.push(text.slice(lastIndex, startIndex));
      }
  
      elements.push(
        <Tooltip
          title={
            <div>
              <div><strong>Source:</strong> {sourceFile}</div>
              <div><strong>Page:</strong> {pageNum}</div>
              <div><strong>Context:</strong> {context}</div>
            </div>
          }
          arrow
          enterDelay={100}
          leaveDelay={200}
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: '1rem',
                maxWidth: 400,
                whiteSpace: 'pre-line',
                bgcolor: '#424242',
                color: '#ffffff',
                padding: '8px',
              },
            },
          }}
        >
          <span
            onClick={async () => {
              try {
                const res = await axios.get('http://127.0.0.1:8000/api/citation-text', {
                  params: {
                    filename: sourceFile,
                    page: parseInt(pageNum),
                    highlight: context
                  }
                });
  
                if (res.data.status === 'success') {
                  onCitationClick({
                    file: sourceFile,
                    page: parseInt(pageNum),
                    blobUrl: pdfBlobs[sourceFile],
                    highlightedPages: res.data.pages,
                    highlightedPage: res.data.highlighted_page
                  });
                } else {
                  console.error('API failed:', res.data.message);
                  alert('Failed to fetch citation text.');
                }
              } catch (error) {
                console.error('Error fetching citation text:', error);
                alert('Error fetching citation text from server.');
              }
            }}
            style={{
              cursor: 'pointer',
              color: '#42a5f5',
              textDecoration: 'underline dotted'
            }}
          >
            [{citationNumber}]
          </span>
        </Tooltip>
      );
  
      lastIndex = startIndex + fullMatch.length;
    }
  
    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
    }
  
    return elements;
  };
  

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;

    const updatedMessages = [...messages, { role: 'user', content: query }];
    setMessages(updatedMessages);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/chat', {
        session_id: sessionId,
        files: selectedFile ? [selectedFile] : fileNames,
        query: query,
        history: JSON.stringify(updatedMessages)
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response || 'No response received'
      };

      setMessages([...updatedMessages, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([...updatedMessages, { role: 'assistant', content: 'Failed to send message.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#27292D',
      }}
    >
      {/* Static Header */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h3" color="text.primary" sx={{ mb: 2 }}>
          💬 Chat with the Report
        </Typography>
        <Divider sx={{ bgcolor: '#424242' }} />
      </Box>
      {/* Scrollable Chat Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          py: 1,
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#424242', borderRadius: '4px' },
          '&::-webkit-scrollbar-track': { backgroundColor: '#27292D' },
          scrollbarWidth: 'thin',
          scrollbarColor: '#424242 #27292D',
        }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                p: 1.5,
                borderRadius: 3,
                bgcolor: msg.role === 'user' ? '#42a5f5' : '#424242',
                color: '#ffffff',
                wordBreak: 'break-word',
              }}
            >
              <Typography
                variant="body1"
                component="span"
                sx={{ display: 'inline' }}
              >
                {parseCitations(msg.content)}
              </Typography>
            </Box>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1.5 }}>
            <CircularProgress size={24} sx={{ color: '#b0bec5' }} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      {/* Static Input and Button */}
      <Box sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="Ask a question"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            disabled={isLoading}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                color: '#ffffff',
                '& fieldset': { borderColor: '#424242' },
                '&:hover fieldset': { borderColor: '#b0bec5' },
                '&.Mui-focused fieldset': { borderColor: '#42a5f5' },
                '&.Mui-disabled fieldset': { borderColor: '#424242' },
              },
              '& .MuiInputBase-input': { color: '#ffffff' },
              '& .MuiInputLabel-root': { color: '#b0bec5' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#42a5f5' },
              '& .MuiInputLabel-root.Mui-disabled': { color: '#b0bec5' },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={isLoading || !query.trim()}
            sx={{
              borderRadius: 3,
              bgcolor: '#42a5f5',
              '&:hover': { bgcolor: '#1e88e5' },
              '&.Mui-disabled': { bgcolor: '#42a5f5', opacity: 0.5 },
              textTransform: 'none',
              height: '40px',
            }}
          >
            Send
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ChatBox;