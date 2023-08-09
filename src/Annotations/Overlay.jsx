import React from 'react'
import PropTypes from 'prop-types'
import { PointInPage } from '../point';


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
        { points.map((p, index) => {
            return (
                <div
                    className='vcs-pdf-point'
                    key={index} // TODO: p.id
                    style={{
                        position: 'absolute',
                        top: p.top * 100 + '%',
                        left: p.left * 100 + '%',
                        border: '1px solid red',
                        transform: 'translate(-5px, -5px)',
                        width: 10,
                        height: 10
                    }}
                />
            )
        }) }
    </div>
  )
}

Overlay.propTypes = {
    points: PropTypes.arrayOf(PropTypes.instanceOf(PointInPage))
}

export default Overlay
