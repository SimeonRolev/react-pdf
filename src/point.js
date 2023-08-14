export class Point {
    constructor({ top, left, page }) {
        this.top = top;
        this.left = left;
        this.page = page;
    }

    /* Pass coordinates starting from the center of the document */
    static fromCenter({ x, y, page }) {
        return new Point({
            top: (page.height / 2 - y * page.dpmm) / page.height,
            left: (x * page.dpmm + page.width / 2) / page.width,
            page
        })
    }

    toCenter () {
        return {
            x: this.left - this.page.width / 2,
            y: -this.top + this.page.height / 2
        }
    }
}

export class Page {
    constructor ({ width, height, dpi }) {
        this.width = width;
        this.height = height;
        this.dpi = dpi;
        this.dpmm = dpi / 25.4;
    }
}

export class Line {
    constructor ({ p1, p2, page }) {
        this.p1 = p1;
        this.p2 = p2;
        this.page = page;
    }

    static fromCenter({ p1, p2, page }) {
        return new Line({
            p1: Point.fromCenter({...p1, page}),
            p2: Point.fromCenter({...p2, page}),
            page
        })
    }
}