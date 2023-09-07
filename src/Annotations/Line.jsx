import React from 'react'
import PropTypes from 'prop-types'
import { Line as LineInstance } from '../models'

function Line({ line, scale, onClick, isSelected }) {
    const ref = React.useRef();

    const onMouseEnter = () => {
        ref.current.style.stroke = "orange"
    }

    const onMouseLeave = () => {
        if (!isSelected) {
            ref.current.style.stroke = "transparent"
        }
    }

    return (
        <React.Fragment>
            <line
                ref={ref}
                x1={line.p1.left * 100 + '%'}
                y1={line.p1.top * 100 + '%'}
                x2={line.p2.left * 100 + '%'}
                y2={line.p2.top * 100 + '%'}
                style={{
                    stroke: isSelected ? "orange" : "transparent",
                    strokeWidth: (1 / scale)
                }}
            />
            <line
                x1={line.p1.left * line.page.width}
                y1={line.p1.top * line.page.height}
                x2={line.p2.left * line.page.width}
                y2={line.p2.top * line.page.height}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={{
                    stroke: "transparent",
                    strokeWidth: 30 / scale
                }}
            />
        </React.Fragment>
    )
}

Line.propTypes = {
    scale: PropTypes.number,
    line: PropTypes.instanceOf(LineInstance),
    onClick: PropTypes.func,
    isSelected: PropTypes.bool
}

export default Line
