import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types'

import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Util, consts
import { Mode, ZOOM_STEP } from "./constants"
import { Page as PageClass } from './models';

// Hooks
import { usePan, usePanOnSpace } from './hooks/pan';
import { useZoomWheel } from './hooks/zoom-wheel';

// UI
import Overlay from './Annotations/Overlay';
import Ghost from './Ghost';
import Store from './Store';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function PDFViewer({
  fileName,
  annotations,
}) {
  const {
    scale, setScale,
    scaleLimit, setScaleLimit,
    mode, setMode,
    setSelection,
    setPages,
    visiblePages
  } = useContext(Store);
  const [transition, setTransition] = useState(false);

  const _initialWidth = React.useRef();
  const _initialHeight = React.useRef();

  const wrapperRef = React.useRef(null);
  const pdfScale = React.useRef(1);
  const canvasRef = React.useRef();
  const rescaledRef = React.useRef();
  const scrollPosition = React.useRef([0, 0]);

  const panProps = usePan({
    getNode: () => wrapperRef.current
  });

  usePanOnSpace({ setMode })

  const isScaleValid = React.useCallback((input) => {
    return input > 0.25 && input < scaleLimit
  }, [scaleLimit])

  React.useEffect(() => {
    const width = Math.max(...visiblePages.map(p => p.width)) * scale
    const height = visiblePages.reduce((acc, curr) => acc + curr.height, 0) * scale;

    _initialWidth.current = width;
    _initialHeight.current = height;
    canvasRef.current.style.width = width + 'px';
    canvasRef.current.style.height = height + 'px';

    rescaledRef.current.style.width = width + 'px';
    rescaledRef.current.style.height = height + 'px';

    const biggestPage = Math.max(...visiblePages.map(p => p.width * p.height))
    const MAX_CANVAS_SIZE = 200000000
    setScaleLimit(Math.sqrt(MAX_CANVAS_SIZE / biggestPage));
  }, [scale, visiblePages])

  function onDocumentLoadSuccess(pdfDoc) {
    Promise.all(
      [...new Array(pdfDoc.numPages)]
        .map((_, index) => pdfDoc.getPage(index + 1))
    ).then(pages => {
      let _pages = {}
      pages.forEach(page => {
        page.width = page.view[2];
        page.height = page.view[3];
        _pages[page.pageNumber] = page
      })

      setPages(_pages)
    })
  }

  const zoomToCursor = React.useCallback((e, isUp = true) => {
    const area = wrapperRef.current
    const { scrollHeight, scrollWidth } = area;

    const xPx = e.clientX + area.scrollLeft - area.offsetLeft
    const yPx = e.clientY + area.scrollTop - area.offsetTop

    const xPerc = xPx / scrollWidth
    const yPerc = yPx / scrollHeight

    // Those don't need to be in a state. directly add them to ref.current.styles.transform = scale(...)
    const currentScale = rescaledRef.current.style.transform.slice(6, rescaledRef.current.style.transform.length - 1)
    const nextScale = parseFloat(currentScale) + (isUp ? ZOOM_STEP : -ZOOM_STEP);
    if (!isScaleValid(nextScale * scale)) return;
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
  }, [isScaleValid, scale])

  const rescalePDF = React.useCallback(() => {
    setTransition(true)
    const resultScale = scale * pdfScale.current
    if (!isScaleValid(resultScale)) return;

    _initialWidth.current = parseFloat(canvasRef.current.style.width)
    _initialHeight.current = parseFloat(canvasRef.current.style.height)

    /* 
    Something like that for zoom above MAX_PDF_ZOOM
    rescaledRef.current.style.transform = `scale(${cssScale / pdfScale}})`
    */
    rescaledRef.current.style.transform = `scale(1)`
    rescaledRef.current.style.width = canvasRef.current.style.width;
    rescaledRef.current.style.height = canvasRef.current.style.height;
    setScale(resultScale)
    setTimeout(() => {
      setTransition(false)
    }, 500)
    /* TODO:
      Instead of setTimeout, could this be a callback to some event handler of the Document?
      Sometimes you'd get area indefined  
    */
    setTimeout(() => {
      wrapperRef.current.scrollTo(...scrollPosition.current)
    }, 200)
  }, [scale, isScaleValid, setScale])

  useZoomWheel({
    onZoom: zoomToCursor,
    onZoomEnd: rescalePDF,
    transition
  })

  const handleEvent = handlerName => e => {
    if (
      e.nativeEvent.which === 2 &&
      Object.keys(panProps).includes(handlerName)
    ) {
      panProps[handlerName](e)
    } else {
      (eventHandlers[mode.name][handlerName] ?? (() => { }))(e)
    }
  }

  const eventHandlers = {
    [Mode.NORMAL.name]: {},
    [Mode.PAN.name]: panProps,
  }

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        overflow: 'scroll'
      }}
      onClick={() => setSelection(null)}
    >
      <div
        id='canvas'
        ref={canvasRef}
        style={{
          margin: 'auto',
          position: 'relative'
        }}
      >
        <Ghost
          fileName={fileName}
          visiblePages={visiblePages}
          scale={scale}
          isVisible={!!transition}
        />
        <div
          id='rescaled'
          ref={rescaledRef}
          style={{
            transform: 'scale(1)', // is being set in the React.useEffect()
            transformOrigin: '0 0',
            opacity: transition ? 0 : 1,
            cursor: panProps.dragging ? 'grabbing' : mode.cursor
          }}
          onClick={handleEvent('onClick')}
          onMouseDown={handleEvent('onMouseDown')}
          onMouseMove={handleEvent('onMouseMove')}
          onMouseUp={handleEvent('onMouseUp')}
          onMouseLeave={handleEvent('onMouseLeave')}
        >
          <Document
            file={fileName}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {
              visiblePages.map(page => {
                return (
                  <Page
                    key={page.pageNumber}
                    scale={scale}
                    pageNumber={page.pageNumber}
                    inputRef={ref => {
                      if (!ref || ref.isEqualNode(page._domNode)) return;
                      page._domNode = ref;
                    }}
                  >
                    <Overlay
                      page={new PageClass({
                        width: page.width,
                        height: page.height
                      })}
                      scale={scale}
                      annotations={annotations[page.pageNumber]}
                    />
                  </Page>
                )
              })
            }

          </Document>
        </div>
      </div>
    </div>
  )
}

PDFViewer.propTypes = {
  fileName: PropTypes.string,
  annotations: PropTypes.object,
}

export default PDFViewer
