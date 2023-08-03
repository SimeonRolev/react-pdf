import { pdfjs } from 'react-pdf';
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { detectMouseWheelDirection } from './util';
import { Mode, ZOOM_STEP } from "./constants"
import { usePan } from './Pan';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function Viewer() {
  const [numPages, setNumPages] = useState();
  /* This is a temp zoom level while zooming with the scroll wheel */
  const [scale, setScale] = useState(1);
  const [mode, setMode] = useState(Mode.NORMAL);
  const panProps = usePan({
    active: mode.name === Mode.PAN.name,
    getNode: () => document.getElementById("available-space")
  });

  const _initialWidth = React.useRef();
  const _initialHeight = React.useRef();

  const pageRefs = {}
  const documentRef = React.useRef();
  const pdfScale = React.useRef();
  const canvasRef = React.useRef();
  const rescaledRef = React.useRef();
  const scrollPosition = React.useRef([0, 0]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);

    setTimeout(() => {
      const { width, height } = documentRef.current.getBoundingClientRect();
      _initialWidth.current = width;
      _initialHeight.current = height;
      canvasRef.current.style.width = width + 'px';
      canvasRef.current.style.height = height + 'px';

      rescaledRef.current.style.width = width + 'px';
      rescaledRef.current.style.height = height + 'px';
    }, 500)
  }

  const getArea = () => {
    return document.getElementById("available-space")
  }

  const zoomToCursor = React.useCallback((e, isUp = true) => {
    const area = getArea()
    const { scrollHeight, scrollWidth } = area;

    const xPx = e.clientX + area.scrollLeft - area.offsetLeft
    const yPx = e.clientY + area.scrollTop - area.offsetTop

    const xPerc = xPx / scrollWidth
    const yPerc = yPx / scrollHeight

    // Those don't need to be in a state. directly add them to ref.current.styles.transform = scale(...)
    const currentScale = rescaledRef.current.style.transform.slice(6, rescaledRef.current.style.transform.length - 1)
    const nextScale = parseFloat(currentScale) + (isUp ? ZOOM_STEP : -ZOOM_STEP);
    pdfScale.current = nextScale
    rescaledRef.current.style.transform = `scale(${nextScale})`

    // TODO: Doesn't rescale canvas properly on zoom in/out, only the first time. canvasRef doesn't get re-initialized?
    canvasRef.current.style.width = (_initialWidth.current * nextScale) + 'px';
    canvasRef.current.style.height = (_initialHeight.current * nextScale) + 'px';

    const { scrollHeight: scrollHeight2, scrollWidth: scrollWidth2 } = area;

    const widthDiff = scrollWidth2 - scrollWidth
    const heightDiff = scrollHeight2 - scrollHeight

    scrollPosition.current = [
      area.scrollLeft + widthDiff * xPerc,
      area.scrollTop + heightDiff * yPerc
    ]

    area.scrollTo(...scrollPosition.current)
  }, [])

  const rescalePDF = React.useCallback(() => {
    _initialWidth.current = parseFloat(canvasRef.current.style.width)
    _initialHeight.current = parseFloat(canvasRef.current.style.height)

    /* 
    Something like that for zoom above MAX_PDF_ZOOM
    rescaledRef.current.style.transform = `scale(${cssScale / pdfScale}})`
    */
    rescaledRef.current.style.transform = `scale(1)`
    rescaledRef.current.style.width = canvasRef.current.style.width;
    rescaledRef.current.style.height = canvasRef.current.style.height;
    setScale(scale * pdfScale.current)
    /* TODO:
      Instead of setTimeout, could this be a callback to some event handler of the Document?
      Sometimes you'd get area indefined  
    */
    setTimeout(() => {
      getArea().scrollTo(...scrollPosition.current)
    }, 200)
  }, [scale])

  const modeHandlers = {
    onClick: {
      [Mode.NORMAL.name]: () => { },
      [Mode.ZOOM_IN.name]: (e) => {
        zoomToCursor(e, true)
        rescalePDF()
      },
      [Mode.ZOOM_OUT.name]: (e) => {
        zoomToCursor(e, false)
        rescalePDF()
      }
    }
  }

  const onClick = (e) => {
    modeHandlers.onClick[mode.name](e)
  }

  /* 
    https://github.com/wojtekmaj/react-pdf/issues/493
  */
  React.useEffect(() => {
    const onWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault()
        zoomToCursor(e, detectMouseWheelDirection(e) === 'up')
      }
    }

    const onKeyUp = e => {
      if (e.key === 'Control' || [Mode.ZOOM_IN.name, Mode.ZOOM_OUT.name].includes[mode.name]) {
        rescalePDF()
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
  }, [_initialHeight, _initialWidth, scale, mode.name, zoomToCursor, rescalePDF])

  return (
    <div
      id="available-space"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        overflow: 'scroll',
      }}
    >
      <div style={{ position: 'fixed', top: 0, zIndex: 9999 }}>
        <button
          onClick={(e) => { e.stopPropagation(); setMode(mode.name === Mode.ZOOM_IN.name ? Mode.NORMAL : Mode.ZOOM_IN) }}
          style={{ backgroundColor: mode.name === Mode.ZOOM_IN.name ? 'lightcyan' : undefined }}  
        >Zoom in</button>
        <button
          onClick={(e) => { e.stopPropagation(); setMode(mode.name === Mode.ZOOM_OUT.name ? Mode.NORMAL : Mode.ZOOM_OUT) }}
          style={{ backgroundColor: mode.name === Mode.ZOOM_OUT.name ? 'lightcyan' : undefined }}  
        >Zoom out</button>
        <button
          onClick={(e) => { e.stopPropagation(); setMode(mode.name === Mode.PAN.name ? Mode.NORMAL : Mode.PAN) }}
          style={{ backgroundColor: mode.name === Mode.PAN.name ? 'lightcyan' : undefined }}  
        >Pan</button>
      </div>;

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
            cursor: mode.cursor
          }}
          onClick={onClick}
          {...panProps}
        >
          <Document
            inputRef={documentRef}
            file="Public Library Sample.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array(numPages).fill(42).map((_, index) => {
              return (
                <Page key={index}
                  inputRef={ref => { pageRefs[index + 1] = ref; }}
                  scale={scale}
                  width={1200}
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
