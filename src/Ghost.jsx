import React from 'react'
import PropTypes from 'prop-types'
import { Document, Page } from 'react-pdf'

function Ghost({ fileName, scale, isVisible }) {
  const [numPages, setNumPages] = React.useState();
  const ref = React.useRef();

  function onDocumentLoadSuccess(doc) {
    setNumPages(doc.numPages)
  }

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        transform: `scale(${scale})`,
        transformOrigin: '0 0',
        opacity: isVisible ? 1 : 0,
        display: isVisible ? 'block' : "none",
        filter: "blur(1px)"
      }}
    >
      <Document
        file={fileName}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {(
          [...new Array(numPages)]
            .map((_, index) => {
              return (
                <Page
                  key={index + 1}
                  pageNumber={index + 1}
                  scale={1}
                />
              )
            })

        )}
      </Document>
    </div>
  )
}

Ghost.propTypes = {
  fileName: PropTypes.string,
  scale: PropTypes.number,
  isVisible: PropTypes.bool,
}

export default Ghost
