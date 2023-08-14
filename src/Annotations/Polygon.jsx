import React from 'react'
import PropTypes from 'prop-types'
import { Polygon as PolygonInstance, Page } from '../point'

function Polygon({ polygon }) {
    const ref = React.useRef();

    return (
        <svg
            viewBox={`0 0 ${polygon.page.width} ${polygon.page.height}`}
            style={{ position: 'absolute', top: 0, left: 0 }}
        >
            <polygon
                ref={ref}
                points={
                    polygon.vertices
                        .map(v => `${v.left * polygon.page.width},${v.top * polygon.page.height}`)
                        .join(' ')
                }
                onMouseEnter={() => { ref.current.style.fill = "rgba(0, 255, 0, 0.2)" }}
                onMouseLeave={() => { ref.current.style.fill = "rgba(255, 0, 0, 0.2)" }}
            ></polygon>
        </svg>
    )
}

Polygon.propTypes = {
    polygon: PropTypes.instanceOf(PolygonInstance),
    page: PropTypes.instanceOf(Page)
}

export default Polygon
