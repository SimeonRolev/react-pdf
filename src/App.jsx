import React from 'react'
import Viewer from './Viewer'

function App() {
  return (
    <Viewer
      fileName={'Public Library Sample.pdf'}
      points={[
        { x: 0, y: 0 },
        { x: -430.544941, y: 79.545809 },
      ]}
    />
  )
}

export default App
