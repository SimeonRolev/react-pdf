import { pdfjs } from 'react-pdf';
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


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

function detectMouseWheelDirection(e) {
  var delta = null,
    direction = false;
  if (!e) { // if the event is not provided, we get it from the window object
    e = window.event;
  }
  if (e.wheelDelta) { // will work in most cases
    delta = e.wheelDelta / 60;
  } else if (e.detail) { // fallback for Firefox
    delta = -e.detail / 2;
  }
  if (delta !== null) {
    direction = delta > 0 ? 'up' : 'down';
  }

  return direction;
}

let whset = false


function Viewer(props) {
  const [numPages, setNumPages] = useState();
  /* This is a temp zoom level while zooming with the scroll wheel */
  const [scale, setScale] = useState(1);
  /* This is the final scale used for the PDF viewer */
  const [zoom, setZoom] = useState(1);

  const [_width, setWidth] = useState();
  const [_height, setHeight] = useState();

  const pageRefs = {}
  let documentRef = null;
  let rescaledRef = React.useRef();

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  /* 
    https://github.com/wojtekmaj/react-pdf/issues/493
  */
  React.useEffect(() => {
    const area = document.getElementById("available-space")

    const onWheel = (e) => {
      if (e.ctrlKey) {

        e.preventDefault()
        const { scrollHeight, scrollWidth } = area;

        const xPx = e.clientX + area.scrollLeft - area.offsetLeft
        const yPx = e.clientY + area.scrollTop - area.offsetTop

        const xPerc = xPx / scrollWidth
        const yPerc = yPx / scrollHeight

        // Those don't need to be in a state. directly add them to ref.current.styles.transform = scale(...)
        const currentScale = rescaledRef.current.style.transform.slice(6, rescaledRef.current.style.transform.length - 1)
        rescaledRef.current.style.transform = `scale(${parseFloat(currentScale) + (detectMouseWheelDirection(e) === 'up' ? 0.1 : -0.1)})`

          const { scrollHeight: scrollHeight2, scrollWidth: scrollWidth2 } = area;
  
          const widthDiff = scrollWidth2 - scrollWidth
          const heightDiff = scrollHeight2 - scrollHeight
  
          area.scrollTo(
            area.scrollLeft + widthDiff * xPerc,
            area.scrollTop + heightDiff * yPerc
          )
      }
    }

    /* TODO: Clarity on Ctrl UP */
    /* TODO: Max zoom. BLurred zoom might not be able to get clear picture on PDF re-render */
    document.body.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      document.body.removeEventListener('wheel', onWheel, { passive: false })
    }
  }, [scale, zoom])

  const onDocumentRef = ref => {
    if (ref) {
      documentRef = ref;

      if (!whset) {
        whset = true;
        setTimeout(() => {
          const { width, height } = ref.getBoundingClientRect();
          setWidth(width);
          setHeight(height);
        }, 500)

      }
    }
  }

  return (
    <div
      id="available-space"
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        display: 'flex',
        overflow: 'scroll',
      }}
    >

{/* TODO: Must get resized on scale changes */}
      <div
        id='canvas'
        style={{
          width: _width * scale,
          height: _height * scale,
          margin: 'auto'
        }}
      >
        <div
          id='rescaled'
          ref={rescaledRef}
          style={{
            width: _width,
            height: _height,
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          <Document
            inputRef={onDocumentRef}
            file="Public Library Sample.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array(numPages).fill(42).map((_, index) => {
              return (
                <Page key={index}
                  inputRef={ref => { pageRefs[index + 1] = ref; }}
                  // scale={zoom}
                  pageNumber={index + 1}
                />
              )
            })}
          </Document>
        </div>
      </div>
    </div>
  )
}

Viewer.propTypes = {}

export default Viewer
