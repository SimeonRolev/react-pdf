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
  return (
    <Viewer
      fileName={'Public Library Sample.pdf'}
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
            ]
          ]
        }
      }}
    />
  )
}

export default App
