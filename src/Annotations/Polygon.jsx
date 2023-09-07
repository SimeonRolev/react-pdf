import React from 'react'
import PropTypes from 'prop-types'
import { Polygon as PolygonInstance } from '../point'

function Polygon({ polygon, scale }) {
    const polylineRef = React.useRef();

    const onMouseEnter = () => {
        polylineRef.current.style.stroke = "orange"
    }

    const onMouseLeave = () => {
        polylineRef.current.style.stroke = "transparent"
    }

    return (
        <React.Fragment>
            <polyline
                ref={polylineRef}
                points={
                    [...polygon.vertices, polygon.vertices[0]]
                        .map(v => `${v.left * polygon.page.width},${v.top * polygon.page.height}`)
                        .join(' ')
                }
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={{
                    fill: "transparent",
                    stroke: "transparent",
                    strokeWidth: 2 / scale
                }}
            ></polyline>
        </React.Fragment>
    )
}

Polygon.propTypes = {
    polygon: PropTypes.instanceOf(PolygonInstance),
    scale: PropTypes.number
}

export default Polygon
