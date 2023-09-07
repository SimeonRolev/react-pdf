/* 
    https://github.com/wojtekmaj/react-pdf/issues/493
*/

import React from 'react';
import { detectMouseWheelDirection } from '../util';

export function useZoomWheel({ onZoom, onZoomEnd, transition }) {
    const wheelingTimeout = React.useRef();
    const clear = () => {
        if (wheelingTimeout.current) {
            clearTimeout(wheelingTimeout.current);
        }
    };

    React.useEffect(() => {
        const onWheel = (e) => {
            e.preventDefault();
            if (!transition) {
                clear();
                onZoom(e, detectMouseWheelDirection(e) === 'up');
                wheelingTimeout.current = setTimeout(() => {
                    onZoomEnd();
                }, 500);
            }
        };

        document.body.addEventListener('wheel', onWheel, { passive: false });
        return () => {
            clear();
            document.body.removeEventListener('wheel', onWheel, {
                passive: false,
            });
        };
    }, [onZoom, onZoomEnd, transition]);
}
