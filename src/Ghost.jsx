import React from 'react'
import PropTypes from 'prop-types'
import { Document, Page } from 'react-pdf'

function Ghost({ fileName, scale, visiblePages, isVisible }) {
  const ref = React.useRef();

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
      >
        {(
          visiblePages
            .map(({ pageNumber }) => {
              return (
                <Page
                  key={pageNumber}
                  pageNumber={pageNumber}
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
  visiblePages: PropTypes.array,
  isVisible: PropTypes.bool,
}

export default Ghost
