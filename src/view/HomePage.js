import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cat.net/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`

function HomePage () {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess ({ numPages }) {
    setNumPages(numPages)
  }

  const goToPreviousPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1))
  }

  const goToNextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages))
  }

  return (
    <div>
      <Document
        file="/test.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div>
        <button
          onClick={goToPreviousPage}
          disabled={pageNumber <= 1}
        >
          Previous
        </button>
        <button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
        >
          Next
        </button>
      </div>
      <p>Page {pageNumber} of {numPages}</p>
    </div>
  )
}

export default HomePage
