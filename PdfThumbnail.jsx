import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const PdfThumbnail = ({ name, onClick, selected }) => {
  return (
    <Card
      sx={{
        width: 230,
        height: 80, // Fits within 80px row
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: selected ? '#1e88e5' : '#2F3135', // 👈 Highlight background if selected
        border: selected ? '2px solid #42a5f5' : '1px solid #424242', // 👈 Highlight border if selected
        color: selected ? '#ffffff' : '#b0bec5', // 👈 Highlight text if selected
        '&:hover': {
          boxShadow: 3,
          backgroundColor: selected ? '#1e88e5' : '#424242', // Darker hover color
        },
      }}
      onClick={onClick}
      aria-label={`Open PDF: ${name}`}
    >
      <CardContent sx={{ textAlign: 'center', p: 0.25 }}>
        <PictureAsPdfIcon
          color={selected ? 'inherit' : 'error'} // 👈 Change icon color if selected
          sx={{ fontSize: '14px' }}
        />
        <Typography
          variant="caption"
          component="div"
          sx={{
            mt: 0.25,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            fontSize: '0.65rem',
            color: selected ? '#ffffff' : '#b0bec5', // 👈 Highlight filename if selected
          }}
        >
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default PdfThumbnail;