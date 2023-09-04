import React from 'react'
import Viewer from './Viewer'
import PageNumberInput from './Components/PageNumberInput';
import { Mode } from './constants';

const annotations = {
  1: {
    points: [
      { x: 0, y: 0 },
      { x: -430.544941, y: 79.545809 },
    ],
    lines: [
      [
        { x: 0, y: 0 },
        { x: -430.544941, y: 79.545809 },
      ]
    ]
  },
  2: {
    polygons: [
      [
        [-437.885417, 316.685986],
        [361.950000, 316.685986],
        [361.950000, -254.814014],
        [-437.885417, -254.814014]
      ],
      [
        [-174, 119],
        [174, 200],
        [200, -200],
      ]
    ]
  }
}


function App() {
  const viewerRef = React.useRef({})
  const [pageNumber, setPageNumber] = React.useState(1);
  const [numPages, setNumPages] = React.useState(undefined);
  const [scale, setScale] = React.useState(1);

  const onDocumentLoadSuccess = React.useCallback((document) => {
    setNumPages(document.numPages)
  }, [])

  const onCurrentPageChange = React.useCallback((page) => {
    setPageNumber(page);
  }, [])

  const onScaleChange = React.useCallback((scale) => {
    setScale(scale)
  }, [])

  const zoomIn = React.useCallback(() => {
    viewerRef.current.setMode(Mode.ZOOM_IN)
  }, [])

  const zoomOut = React.useCallback(() => {
    viewerRef.current.setMode(Mode.ZOOM_OUT)
  }, [])

  const scrollToPage = (n) => {
    if (n > 0 && n <= numPages) {
      viewerRef.current.scrollToPage(n)
    }
  }

  const togglePanMode = () => {
    if (viewerRef.current.mode !== Mode.PAN) {
      viewerRef.current.setMode(Mode.PAN);
    } else {
      viewerRef.current.setMode(Mode.NORMAL)
    }
  }

  return (
    <div
      id='playground'
      style={{ marginTop: 100, height: '80%' }}
    >
      <Viewer
        viewerRef={viewerRef}
        fileName={'Public Library Sample.pdf'}
        onDocumentLoadSuccess={onDocumentLoadSuccess}
        onCurrentPageChange={onCurrentPageChange}
        onScaleChange={onScaleChange}
        annotations={annotations}
      />
      <div
        id='toolbar'
        style={{
          position: 'fixed',
          bottom: 15,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{
          background: 'rgba(0,0,0,0.5)',
          padding: 20,
          borderRadius: 4,
        }}>
          Zoom:
          <button onClick={zoomOut}>-</button>
          <span>{parseInt(scale * 100) + '%'}</span>
          <button onClick={zoomIn}>+</button>

          <button onClick={() => scrollToPage(pageNumber - 1)}>Prev</button>
          <PageNumberInput
            initialValue={pageNumber}
            max={numPages}
            onSubmit={scrollToPage}
          /> / <span>{numPages}</span>
          <button onClick={() => scrollToPage(pageNumber + 1)}>Next</button>
          <button onClick={togglePanMode}>Pan</button>
        </div>
      </div>
    </div>
  )
}

export default App
