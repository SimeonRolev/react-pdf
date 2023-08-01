import { pdfjs } from 'react-pdf';
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { detectMouseWheelDirection } from './util';
import { ZOOM_STEP } from "./constants"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

let whset = false


function Viewer(props) {
  const [numPages, setNumPages] = useState();
  /* This is a temp zoom level while zooming with the scroll wheel */
  const [scale, setScale] = useState(1);

  const _initialWidth = React.useRef();
  const _initialHeight = React.useRef();

  const pageRefs = {}
  let documentRef = null;
  let canvasRef = React.useRef();
  let rescaledRef = React.useRef();

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  /* 
    https://github.com/wojtekmaj/react-pdf/issues/493
  */
  React.useEffect(() => {
    const area = document.getElementById("available-space")
    /* TODO: Can the tempCSSScale be React.useRef(1) */
    let pdfScale = 1;
    let scrollPosition = [0, 0];

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
        const nextScale = parseFloat(currentScale) + (detectMouseWheelDirection(e) === 'up' ? ZOOM_STEP : -ZOOM_STEP);
        pdfScale = nextScale;
        rescaledRef.current.style.transform = `scale(${nextScale})`

        // TODO: Doesn't rescale canvas properly on zoom in/out, only the first time. canvasRef doesn't get re-initialized?
        canvasRef.current.style.width = (_initialWidth.current * nextScale) + 'px';
        canvasRef.current.style.height = (_initialHeight.current * nextScale) + 'px';

        const { scrollHeight: scrollHeight2, scrollWidth: scrollWidth2 } = area;

        const widthDiff = scrollWidth2 - scrollWidth
        const heightDiff = scrollHeight2 - scrollHeight

        scrollPosition = [
          area.scrollLeft + widthDiff * xPerc,
          area.scrollTop + heightDiff * yPerc
        ]

        area.scrollTo(...scrollPosition)
      }
    }

    const onKeyUp = e => {
      if (e.key === 'Control') {
        _initialWidth.current = parseFloat(canvasRef.current.style.width)
        _initialHeight.current = parseFloat(canvasRef.current.style.height)

        /* 
        Something like that for zoom above MAX_PDF_ZOOM
        rescaledRef.current.style.transform = `scale(${cssScale / pdfScale}})`
        */
        rescaledRef.current.style.transform = `scale(1)`
        setScale(scale * pdfScale)
        /* TODO:
          Instead of setTimeout, could this be a callback to some event handler of the Document?
          Sometimes you'd get area indefined  
        */
        setTimeout(() => {
          document.getElementById("available-space").scrollTo(...scrollPosition)
        }, 200)
      }
    }

    /* TODO: Clarity on Ctrl UP */
    /* TODO: Max zoom. BLurred zoom might not be able to get clear picture on PDF re-render */
    document.body.addEventListener('wheel', onWheel, { passive: false });
    document.body.addEventListener('keyup', onKeyUp, { passive: false })
    return () => {
      document.body.removeEventListener('wheel', onWheel, { passive: false })
      document.body.removeEventListener('keyup', onKeyUp, { passive: false })
    }
  }, [_initialHeight, _initialWidth, scale])

  const onDocumentRef = ref => {
    if (ref) {
      documentRef = ref;

      /* TODO: Check if this is enough for big PDFs - hundreds of pages. */
      if (!whset) {
        whset = true;
        setTimeout(() => {
          const { width, height } = ref.getBoundingClientRect();
          _initialWidth.current = width;
          _initialHeight.current = height;
          canvasRef.current.style.width = width + 'px';
          canvasRef.current.style.height = height + 'px';

          rescaledRef.current.style.width = width + 'px';
          rescaledRef.current.style.height = height + 'px';
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
        ref={canvasRef}
        style={{
          margin: 'auto'
        }}
      >
        <div
          id='rescaled'
          ref={rescaledRef}
          style={{
            transform: 'scale(1)', // is being set in the React.useEffect()
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
                  scale={scale}
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
