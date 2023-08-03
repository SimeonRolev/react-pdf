import React from 'react';

export function usePan ({ active, getNode }) {
    const [dragging, setDragging] = React.useState(false);
    const initialCoordinates = React.useRef({x : 0, y: 0});
    const node = React.useRef(null)

    const onMouseDown = (e) => {
        e.preventDefault();
        setDragging(true);
        node.current = getNode();
        initialCoordinates.current = {
            x: e.clientX,
            y: e.clientY,
            scrollTop: node.current.scrollTop,
            scrollLeft: node.current.scrollLeft,
        };
    };

    const onMouseMove = (e) => {
        if (node.current && dragging) {
            node.current.scrollLeft = initialCoordinates.current.scrollLeft + (initialCoordinates.current.x - e.clientX);
            node.current.scrollTop = initialCoordinates.current.scrollTop + (initialCoordinates.current.y - e.clientY);
        }
    };

    const onMouseLeave = () => {
        setDragging(false)
    }

    const onMouseUp = () => {
        setDragging(false)
    };

    return active ? {
        onClick: () => {},
        onMouseDown: onMouseDown,
        onMouseMove: onMouseMove,
        onMouseUp: onMouseUp,
        onMouseLeave: onMouseLeave,
        style: {
            cursor: dragging ? 'grabbing' : 'grab'
        }
    } : {}
}
