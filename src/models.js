export class Point {
    constructor({ top, left, page, vectorworksCoordinates }) {
        this.top = top;
        this.left = left;
        this.page = page;
        this.vectorworksCoordinates = vectorworksCoordinates || this.toVectorworks();
    }

    /* Pass coordinates starting from the center of the document */
    static fromCenter({ x, y, page }) {
        return new Point({
            top: (page.height / 2 - y * page.dpmm) / page.height,
            left: (x * page.dpmm + page.width / 2) / page.width,
            page,
            vectorworksCoordinates: {x ,y}
        })
    }

    toCenter () {
        return {
            x: this.left * this.page.width - this.page.width / 2,
            y: -this.top * this.page.height + this.page.height / 2
        }
    }

    toVectorworks () {
        const {x, y} = this.toCenter()
        return {
            x: x / this.page.dpmm,
            y: y / this.page.dpmm,
        }
    }

    info () {
        return JSON.stringify(this.vectorworksCoordinates)
    }

    compare (other) {
        return other instanceof Point && this.top === other.top && this.left === other.left;
    }
}

export class Page {
    constructor ({ width, height, dpi = 72 }) {
        this.width = width;
        this.height = height;
        /* TODO: Get the DPI from the XML */
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


    info () {
        return [this.p1, this.p2]
            .reduce((result, vertex) => result + JSON.stringify(vertex.vectorworksCoordinates) + '\n', "")
    }

    compare (other) {
        return other instanceof Line && this.p1.compare(other.p1) && this.p2.compare(other.p2)
    }
}

export class Polygon {
    constructor({ vertices, page }) {
        this.vertices = vertices;
        this.page = page;
    }

    static fromCenter({ vertices, page }) {
        return new Polygon({
            vertices: vertices.map(vertex => Point.fromCenter({ x: vertex[0], y: vertex[1], page })),
            page
        })
    }

    info () {
        return this.vertices
            .reduce((result, vertex) => result + JSON.stringify(vertex.vectorworksCoordinates) + '\n', "")
    }

    compare (other) {
        return other instanceof Polygon && this.vertices.every((v, index) => v.compare(other.vertices[index]))
    }
}