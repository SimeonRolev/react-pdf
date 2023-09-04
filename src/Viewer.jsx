import React, { useState } from 'react';
import PropTypes from 'prop-types'

import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { detectMouseWheelDirection } from './util';
import { Mode, ZOOM_STEP } from "./constants"
import { usePan, usePanOnSpace } from './Pan';
import Overlay from './Annotations/Overlay';
import { Page as PageClass } from './point';
import Ghost from './Ghost';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function Viewer({
  fileName,
  annotations,
  onDocumentLoadSuccess: onDocumentLoadSuccessCallback,
  onCurrentPageChange,
  onScaleChange,
  viewerRef
}) {
  /* This is a temp zoom level while zooming with the scroll wheel */
  const [scale, setScale] = useState(1);
  const [scaleLimit, setScaleLimit] = useState(10);
  const [transition, setTransition] = useState(false);
  const [mode, setMode] = useState(Mode.NORMAL);
  const [observePages, setObservePages] = useState(false);
  const [numPages, setNumPages] = useState();

  const [loading, setLoading] = useState(true);

  const _initialWidth = React.useRef();
  const _initialHeight = React.useRef();

  const wrapperRef = React.useRef(null);
  const pageRefs = React.useRef({});
  const pdfScale = React.useRef(1);
  const canvasRef = React.useRef();
  const rescaledRef = React.useRef();
  const scrollPosition = React.useRef([0, 0]);
  const wheeling = React.useRef(false);

  const panProps = usePan({
    getNode: () => wrapperRef.current
  });

  usePanOnSpace({ setMode })

  const isScaleValid = React.useCallback((input) => {
    return input > 0.25 && input < scaleLimit
  }, [scaleLimit])

  function onDocumentLoadSuccess(pdfDoc) {
    setNumPages(pdfDoc.numPages)

    Promise.all(
      [...new Array(pdfDoc.numPages)]
        .map((_, index) => pdfDoc.getPage(index + 1))
    ).then(pages => {
      pages.forEach(page => {
        page.width = page.view[2];
        page.height = page.view[3];
        pageRefs.current[page.pageNumber] = page
      })

      const width = Math.max(...pages.map(p => p.width))
      const height = pages.reduce((acc, curr) => acc + curr.height, 0);

      _initialWidth.current = width;
      _initialHeight.current = height;
      canvasRef.current.style.width = width + 'px';
      canvasRef.current.style.height = height + 'px';

      rescaledRef.current.style.width = width + 'px';
      rescaledRef.current.style.height = height + 'px';

      const biggestPage = Math.max(...pages.map(p => p.width * p.height))
      const MAX_CANVAS_SIZE = 200000000
      setScaleLimit(Math.sqrt(MAX_CANVAS_SIZE / biggestPage));

      setLoading(false)
      onDocumentLoadSuccessCallback(pdfDoc)
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
    onScaleChange(resultScale)
    setTransition(true)
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
  }, [scale, isScaleValid, onScaleChange])

  /* 
    https://github.com/wojtekmaj/react-pdf/issues/493
  */
  React.useEffect(() => {
    const onWheel = (e) => {
      wheeling.current = true;
      if (e.ctrlKey) {
        e.preventDefault()
        zoomToCursor(e, detectMouseWheelDirection(e) === 'up')
      }
    }

    const onKeyUp = e => {
      if (e.key === 'Control') {
        if (wheeling.current === true) {
          wheeling.current = false;
          rescalePDF()
        }
      }
      if ([Mode.ZOOM_IN.name, Mode.ZOOM_OUT.name].includes[mode.name]) {
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

  React.useEffect(() => {
    const nodes = Object.values(pageRefs.current).map(p => p._domNode)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.setAttribute('data-intersecting', entry.isIntersecting);
      })

      const pageNumber = Math.min(
        ...nodes
          .filter(node => node.getAttribute('data-intersecting') === 'true')
          .map(node => parseInt(node.getAttribute('data-page-number')))
      )

      if (pageNumber > 0 && pageNumber <= numPages) {
        onCurrentPageChange(pageNumber)
      }
    }, {
      root: wrapperRef.current
    })

    nodes.forEach(node => observer.observe(node))
    return () => {
      observer.disconnect()
    }
  }, [numPages, observePages, onCurrentPageChange])

  const scrollToPage = (n) => {
    wrapperRef.current.scrollTo({
      top: pageRefs.current[n]._domNode.offsetTop + 1,
      behavior: 'smooth'
    })
  }

  viewerRef.current = {
    scrollToPage,
    setMode,
    mode
  }
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
    [Mode.ZOOM_IN.name]: {
      onClick: (e) => {
        zoomToCursor(e, true)
        rescalePDF()
      }
    },
    [Mode.ZOOM_OUT.name]: {
      onClick: (e) => {
        zoomToCursor(e, false)
        rescalePDF()
      }
    }
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
            {!loading && (
              Object.values(pageRefs.current).map(page => {
                return (
                  <Page
                    key={page.pageNumber}
                    scale={scale}
                    pageNumber={page.pageNumber}
                    inputRef={ref => {
                      if (!ref || ref.isEqualNode(page._domNode)) return;
                      page._domNode = ref;
                      setObservePages(Object.values(pageRefs.current).every(p => !!p._domNode))
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
            )}

          </Document>
        </div>
      </div>
    </div>
  )
}

Viewer.defaultProps = {
  onDocumentLoadSuccess: () => { },
  onCurrentPageChange: () => { },
}

Viewer.propTypes = {
  fileName: PropTypes.string,
  annotations: PropTypes.arrayOf(PropTypes.any),
  onDocumentLoadSuccess: PropTypes.func,
  onCurrentPageChange: PropTypes.func,
  onScaleChange: PropTypes.func,
  viewerRef: PropTypes.object
}

export default Viewer
