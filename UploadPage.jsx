import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import FileUpload from './FileUpload';
import { useNavigate } from 'react-router-dom';

const UploadPage = ({ onReportGenerated, onError, existingFileNames = [] }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#27292D',
        color: '#ffffff',
        p: 2,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            mb: 4,
            fontSize: { xs: '2rem', sm: '3rem' },
            fontWeight: 'bold',
            color: '#b0bec5',
          }}
        >
          Upload Your Files
        </Typography>
        <FileUpload
          onReportGenerated={onReportGenerated}
          onError={onError}
          navigate={navigate}
          showAnalyzeButton={false}
          existingFileNames={existingFileNames}
        />
      </Container>
    </Box>
  );
};

export default UploadPage;



