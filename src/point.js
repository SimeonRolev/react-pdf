export class Point {
    constructor({ top, left }) {
        this.top = top;
        this.left = left;
    }

    /* Pass coordinates starting from the center of the document */
    static fromCenter({ x, y, pageWidth, pageHeight}) {
        return new Point({
            top: pageHeight / 2 - y,
            left: x + pageWidth / 2
        })
    }

    toCenter () {
        return {
            x: this.left - 600,
            y: -this.top + 400
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
