import React from 'react'
import PropTypes from 'prop-types'
import { Line as LineInstance } from '../point'

function Line({ line, scale }) {
    const ref = React.useRef();

    return (
        <svg
            viewBox={`0 0 ${line.page.width} ${line.page.height}`}
            style={{ position: 'absolute', top: 0, left: 0 }}
        >
            <line
                ref={ref}
                x1={line.p1.left * 100 + '%'}
                y1={line.p1.top * 100 + '%'}
                x2={line.p2.left * 100 + '%'}
                y2={line.p2.top * 100 + '%'}
                style={{ stroke: "rgb(255,0,0)", strokeWidth: (1 / scale) }}
            />
            <line
                x1={line.p1.left * line.page.width}
                y1={line.p1.top * line.page.height}
                x2={line.p2.left * line.page.width}
                y2={line.p2.top * line.page.height}
                style={{ stroke: "transparent", strokeWidth: 30 / scale }}
                onMouseEnter={() => { ref.current.style.stroke = "rgb(0, 255, 0)" }}
                onMouseLeave={() => { ref.current.style.stroke = "rgb(255, 0, 0)" }}
            />
        </svg>
    )
}

Line.propTypes = {
    scale: PropTypes.number,
    line: PropTypes.instanceOf(LineInstance)
}

export default Line
