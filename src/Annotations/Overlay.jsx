import React from 'react'
import PropTypes from 'prop-types'
import { Point } from '../point';
import PointUI from './Point';


function Overlay({
    points = []
}) {
  return (
    <div
        style={{
            position: 'absolute',
            top: 0, left: 0, bottom: 0, right: 0,
            zIndex: 2
        }}
    >
        { points.map((point, index) => <PointUI key={index} point={point} /> )}
    </div>
  )
}

Overlay.propTypes = {
    points: PropTypes.arrayOf(PropTypes.instanceOf(Point))
}

export default Overlay
