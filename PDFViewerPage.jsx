import { useSearchParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css'; // optional but improves text selection/highlights


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewerPage = () => {
  const [searchParams] = useSearchParams();
  const file = searchParams.get('file');
  const page = parseInt(searchParams.get('page')) || 1;

  const [numPages, setNumPages] = useState(null);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{file}</h2>
      <Document
        file={`/pdfs/${file}`}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={console.error}
      >
        <Page pageNumber={page} width={800} />
      </Document>
      <p>Page {page} of {numPages}</p>
    </div>
  );
};

export default PDFViewerPage;


