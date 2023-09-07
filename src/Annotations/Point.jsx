import React from 'react'
import PropTypes from 'prop-types'
import { Point } from '../point'

function PointUI({point, isSelected, ...rest}) {
    const ref = React.useRef(null)

    const onMouseEnter = () => {
        ref.current.style.borderColor = "orange"
    }

    const onMouseLeave = () => {
        if (!isSelected) {
            ref.current.style.borderColor = "transparent"
        }
    }

    return (
        <div
            className='vcs-pdf-point'
            ref={ref}
            style={{
                position: 'absolute',
                top: point.top * 100 + '%',
                left: point.left * 100 + '%',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isSelected ? 'orange' : 'transparent',
                transform: 'translate(-5px, -5px)',
                width: 10,
                height: 10
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...rest}
        />
    )
}

PointUI.propTypes = {
    point: PropTypes.instanceOf(Point),
    isSelected: PropTypes.bool
}

export default PointUI
