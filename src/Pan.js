import React from 'react';
import { Mode } from './constants';

/* TODO: Attach the events to the viewer not the docment */
/* TODO: Fix pan, zoom in, pan mode clicking bug */

export function usePanOnSpace({ setMode }) {
    React.useEffect(() => {
        const disposers = [];

        const onSpaceDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setMode(Mode.PAN);
            }
        };
        const onSpaceUp = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setMode(Mode.NORMAL);
            }
        };

        document.body.addEventListener('keydown', onSpaceDown);
        document.body.addEventListener('keyup', onSpaceUp);
        disposers.push(() =>
            document.body.removeEventListener('keydown', onSpaceDown)
        );
        disposers.push(() =>
            document.body.removeEventListener('keyup', onSpaceUp)
        );

        return () => {
            disposers.forEach((d) => d());
            disposers.length = 0;
        };
    }, [setMode]);
}

export function usePan({ getNode }) {
    const [dragging, setDragging] = React.useState(false);
    const initialCoordinates = React.useRef({ x: 0, y: 0 });
    const node = React.useRef(null);

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
            node.current.scrollLeft =
                initialCoordinates.current.scrollLeft +
                (initialCoordinates.current.x - e.clientX);
            node.current.scrollTop =
                initialCoordinates.current.scrollTop +
                (initialCoordinates.current.y - e.clientY);
        }
    };

    const onMouseLeave = () => {
        setDragging(false);
    };

    const onMouseUp = () => {
        setDragging(false);
    };

    return {
        onMouseDown: onMouseDown,
        onMouseMove: onMouseMove,
        onMouseUp: onMouseUp,
        onMouseLeave: onMouseLeave,
    };
}
