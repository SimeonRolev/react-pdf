import React, { useState } from 'react';
import PropTypes from 'prop-types'

import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { detectMouseWheelDirection, isScaleValid } from './util';
import { Mode, ZOOM_STEP } from "./constants"
import { usePan } from './Pan';
import Overlay from './Annotations/Overlay';
import { Page as PageClass } from './point';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function Viewer({
  fileName,
  annotations,
  onDocumentLoadSuccess: onDocumentLoadSuccessCallback,
  onCurrentPageChange,
  viewerRef
}) {
  /* This is a temp zoom level while zooming with the scroll wheel */
  const [scale, setScale] = useState(1);
  const [transition, setTransition] = useState(false);
  const [mode, setMode] = useState(Mode.NORMAL);
  const [observePages, setObservePages] = useState(false);

  const [loading, setLoading] = useState(true);

  const _initialWidth = React.useRef();
  const _initialHeight = React.useRef();

  const wrapperRef = React.useRef(null);
  const pageRefs = React.useRef({});
  const documentRef = React.useRef();
  const pdfScale = React.useRef(1);
  const canvasRef = React.useRef();
  const rescaledRef = React.useRef();
  const ghostRef = React.useRef();
  const scrollPosition = React.useRef([0, 0]);
  const wheeling = React.useRef(false);

  const panProps = usePan({
    active: mode.name === Mode.PAN.name,
    getNode: () => wrapperRef.current
  });

  function onDocumentLoadSuccess(pdfDoc) {
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
      ghostRef.current.style.width = width + 'px';
      ghostRef.current.style.height = height + 'px';

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
  }, [scale])

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
    ghostRef.current.style.transform = `scale(${resultScale})`
    setScale(resultScale)
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
  }, [scale, ghostRef])

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

      onCurrentPageChange(
        Math.min(
          ...nodes
            .filter(node => node.getAttribute('data-intersecting') === 'true')
            .map(node => parseInt(node.getAttribute('data-page-number')))
        )
      )
    }, {
      root: wrapperRef.current
    })

    nodes.forEach(node => observer.observe(node))
    return () => {
      observer.disconnect()
    }
  }, [observePages, onCurrentPageChange])

  const scrollToPage = (n) => {
    wrapperRef.current.scrollTo({
      top: pageRefs.current[n]._domNode.offsetTop + 1,
      behavior: 'smooth'
    })
  }

  React.useEffect(() => {
    viewerRef.current = {
      scrollToPage
    }
  }, [viewerRef])

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
        <div
          id='rescaled-ghost'
          ref={ghostRef}
          style={{
            position: 'absolute',
            inset: 0,
            transform: 'scale(1)', // is being set in the React.useEffect()
            transformOrigin: '0 0',
            cursor: mode.cursor,
            opacity: transition ? 1 : 0,
            display: transition ? 'block' : "none",
            filter: "blur(1px)"
          }}
          key={42}
        >
          <Document
            key={42}
            file={fileName}
          >
            {(
              Object.values(pageRefs.current).map(page => {
                return (
                  <Page
                    key={page.pageNumber}
                    scale={1}
                    pageNumber={page.pageNumber}
                  >
                  </Page>
                )
              })
            )}
          </Document>
        </div>
        <div
          id='rescaled'
          ref={rescaledRef}
          style={{
            transform: 'scale(1)', // is being set in the React.useEffect()
            transformOrigin: '0 0',
            cursor: mode.cursor,
            opacity: transition ? 0 : 1
          }}
          onClick={onClick}
          {...panProps}
        >
          <Document
            inputRef={documentRef}
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
                        height: page.height,
                        /* TODO: Get the DPI from the XML */
                        dpi: 72
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
  viewerRef: PropTypes.object
}

export default Viewer
