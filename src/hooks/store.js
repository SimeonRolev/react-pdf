import { useEffect, useRef, useState } from 'react';

export function useStore() {
    const pageRefs = useRef({});
    const [scale, setScale] = useState(1);
    const [pages, setPages] = useState({});
    const [visiblePages, setVisiblePages] = useState([]);

    useEffect(() => {
        pages[1] && setVisiblePages([pages[1]]);
    }, [pages]);

    const toPage = (n) => {
        setVisiblePages([pages[n]]);
    };

    const prevPage = () => {
        const current = visiblePages[0].pageNumber;
        if (pages[current - 1]) {
            setVisiblePages([pages[current - 1]]);
        }
    };

    const nextPage = () => {
        const current = visiblePages[0].pageNumber;
        if (pages[current + 1]) {
            setVisiblePages([pages[current + 1]]);
        }
    };

    return {
        pageRefs,
        scale,
        setScale,
        pages,
        setPages,
        visiblePages,
        setVisiblePages,
        navigate: {
            toPage,
            prevPage,
            nextPage,
        },
    };
}
