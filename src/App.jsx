import React from 'react'
import Viewer from './Viewer'
import PageNumberInput from './Components/PageNumberInput';
import { Mode } from './constants';
import '@vectorworks/vcs-ui/dist/colors.css'
import '@vectorworks/vcs-ui/dist/base.css'
import '@vectorworks/vcs-icons/style.css';

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

window.gettext = val => val;

function App() {
  const viewerRef = React.useRef({})
  const [pageNumber, setPageNumber] = React.useState(1);
  const [numPages, setNumPages] = React.useState(undefined);
  const [scale, setScale] = React.useState(1);

  const onDocumentLoadSuccess = React.useCallback((document) => {
    setNumPages(document.numPages)
  }, [])

  const onScaleChange = React.useCallback((scale) => {
    setScale(scale)
  }, [])

  const scrollToPage = (n) => {
    if (n > 0 && n <= numPages) {
      setPageNumber(n);
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
          <span>{parseInt(scale * 100) + '%'}</span>

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
