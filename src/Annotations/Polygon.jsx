import React from 'react'
import PropTypes from 'prop-types'
import { Polygon as PolygonInstance } from '../point'

function Polygon({ polygon, scale, onClick, isSelected }) {
    const polylineRef = React.useRef();

    const onMouseEnter = () => {
        polylineRef.current.style.stroke = "orange"
    }

    const onMouseLeave = () => {
        if (!isSelected) {
            polylineRef.current.style.stroke = "transparent"
        }
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
                onClick={onClick}
                style={{
                    fill: "transparent",
                    stroke: isSelected ? "orange" : "transparent",
                    strokeWidth: 1 / scale
                }}
            ></polyline>
        </React.Fragment>
    )
}

Polygon.propTypes = {
    polygon: PropTypes.instanceOf(PolygonInstance),
    scale: PropTypes.number,
    onClick: PropTypes.func,
    isSelected: PropTypes.bool
}

export default Polygon
