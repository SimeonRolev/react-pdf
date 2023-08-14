import React from 'react'
import PropTypes from 'prop-types'
import { Point } from '../point'

function PointUI({point, ...rest}) {
    const ref = React.useRef(null)

    return (
        <div
            className='vcs-pdf-point'
            ref={ref}
            style={{
                position: 'absolute',
                top: point.top * 100 + '%',
                left: point.left * 100 + '%',
                border: '1px solid red',
                transform: 'translate(-5px, -5px)',
                width: 10,
                height: 10,
                opacity: 0
            }}
            onMouseOver={() => ref.current.style.opacity = 1}
            onMouseLeave={() => ref.current.style.opacity = 0}
            {...rest}
        />
    )
}

PointUI.propTypes = {
    point: PropTypes.instanceOf(Point)
}

export default PointUI
