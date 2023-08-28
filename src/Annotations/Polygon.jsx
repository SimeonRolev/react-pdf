import React from 'react'
import PropTypes from 'prop-types'
import { Polygon as PolygonInstance, Page } from '../point'

function Polygon({ polygon }) {
    const ref = React.useRef();

    return (
        <polygon
            ref={ref}
            points={
                polygon.vertices
                    .map(v => `${v.left * polygon.page.width},${v.top * polygon.page.height}`)
                    .join(' ')
            }
            onMouseEnter={() => { ref.current.style.fill = "rgba(0, 255, 0, 0.2)" }}
            onMouseLeave={() => { ref.current.style.fill = "rgba(255, 0, 0, 0)" }}
            style={{ fill: "rgba(255, 0, 0, 0)" }}
        ></polygon>
    )
}

Polygon.propTypes = {
    polygon: PropTypes.instanceOf(PolygonInstance),
    page: PropTypes.instanceOf(Page)
}

export default Polygon
