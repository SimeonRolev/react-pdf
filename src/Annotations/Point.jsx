import React from 'react'
import PropTypes from 'prop-types'
import { Point } from '../point'

function PointUI({point, ...rest}) {
    return (
        <div
            className='vcs-pdf-point'
            style={{
                position: 'absolute',
                top: point.top * 100 + '%',
                left: point.left * 100 + '%',
                border: '1px solid red',
                transform: 'translate(-5px, -5px)',
                width: 10,
                height: 10
            }}
            {...rest}
        />
    )
}

PointUI.propTypes = {
    point: PropTypes.instanceOf(Point)
}

export default PointUI
