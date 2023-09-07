import React from 'react'
import Viewer from './Viewer'
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
  return (
    <div
      id='playground'
      style={{
        height: '100%'
      }}
    >
      <Viewer
        fileName={'Public Library Sample.pdf'}
        annotations={annotations}
      />
    </div>
  )
}

export default App
