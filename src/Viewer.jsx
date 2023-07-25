import { pdfjs } from 'react-pdf';
import { useState } from 'react';
import { Document, Page } from 'react-pdf';

import React from 'react'
import PropTypes from 'prop-types'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

/* 
Scale only the visible pages
*/
function isElementInViewport(el) {
  if (!el) return false;
  var rect = el.getBoundingClientRect();

  return rect.bottom > 0 &&
    rect.right > 0 &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */ &&
    rect.top < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */;
}

function Viewer(props) {
  const [numPages, setNumPages] = useState();
  const [scale, setScale] = useState(1);

  const pageRefs = {}

  const zoomIn = () => {
    setScale(scale + 0.2)
  }
  const zoomOut = () => {
    setScale(scale - 0.2)
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  React.useEffect(() => {
    document.addEventListener('scroll', () => {
      Object
        .keys(pageRefs)
        .forEach(pn => {
          if (pn) {
            console.log([pn, isElementInViewport(pageRefs[pn])])
          }
        })
    
    })
  })

  return (
    <div>
      <div style={{ position: "fixed", top: 0, zIndex: 10 }}>
        <button onClick={zoomIn}>+</button>
        <button onClick={zoomOut}>-</button>
      </div>

      <Document file="Public Library Sample.pdf" onLoadSuccess={onDocumentLoadSuccess}>
        {Array(numPages).fill(42).map((_, index) => {
          return (
            <Page key={index}
              inputRef={ref => { pageRefs[index + 1] = ref; }}
              scale={scale}
              pageNumber={index + 1}
            />
          )
        })}
      </Document>
    </div>
  )
}

Viewer.propTypes = {}

export default Viewer
