export class Point {
    constructor({ top, left }) {
        this.top = top;
        this.left = left;
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
