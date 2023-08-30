import React from 'react'
import Viewer from './Viewer'

/*
In page 2:
<Poly>
<Vertex>
<x>-437.885417</x>
<y>316.685986</y>
</Vertex>
<Vertex>
<x>361.950000</x>
<y>316.685986</y>
</Vertex>
<Vertex>
<x>361.950000</x>
<y>-254.814014</y>
</Vertex>
<Vertex>
<x>-437.885417</x>
<y>-254.814014</y>
</Vertex>
</Poly>
 */


function App() {
  const [pageNumber, setPageNumber] = React.useState(1);
  const [numPages, setNumPages] = React.useState(undefined);

  const onDocumentLoadSuccess = (document) => {
    setNumPages(document.numPages)
  }

  const onCurrentPageChange = React.useCallback((page) => {
    setPageNumber(page);
  }, [])

  return (
    <div
      id='playground'
      style={{ marginTop: 100, height: '80%' }}
    >
      <Viewer
        onDocumentLoadSuccess={onDocumentLoadSuccess}
        fileName={'Public Library Sample.pdf'}
        onCurrentPageChange={onCurrentPageChange}
        annotations={{
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
        }}
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
          <span>{pageNumber}</span> / <span>{numPages}</span> 
        </div>
      </div>
    </div>
  )
}

export default App
