import React from 'react'
import PropTypes from 'prop-types'
import { Page, Point, Line } from '../point';
import PointUI from './Point';
import LineUI from './Line';


function Overlay({ page, scale, annotations = {} }) {

    const points = (annotations.points || []).map(({ x, y }) => {
        return Point.fromCenter({
            x, y, page
        })
    })

    const lines = (annotations.lines || []).map(line => {
        return Line.fromCenter({ p1: line[0], p2: line[1], page });
    })

    return (
        <div
            style={{
                position: 'absolute',
                top: 0, left: 0,
                width: page.width * scale,
                height: page.height * scale,
                zIndex: 2
            }}
        >
            {lines.map((line, index) => <LineUI key={index} line={line} scale={scale} />)}
            {points.map((point, index) => <PointUI key={index} point={point} />)}
        </div>
    )
}

Overlay.propTypes = {
    page: PropTypes.instanceOf(Page),
    scale: PropTypes.number,
    annotations: PropTypes.shape({
        points: PropTypes.arrayOf(PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        })),
        lines: PropTypes.arrayOf(PropTypes.any),
    })
}

export default Overlay
