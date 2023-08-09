import { it } from 'vitest';
import { Page, Point } from './point';


it('From center coordinate system', ({ expect }) => {
    const page = new Page({ width: 1200, height: 800, dpi: 72 })
    const point = Point.fromCenter({
        x: 0,
        y: 0,
        pageWidth: page.width,
        pageHeight: page.height
    })
    expect(point.left).toBe(600);
    expect(point.top).toBe(400);
    expect(point.toCenter().x).toBe(0);
    expect(point.toCenter().y).toBe(0);

    const point2 = Point.fromCenter({
        x: 100,
        y: 200,
        pageWidth: page.width,
        pageHeight: page.height
    })
    expect(point2.left).toBe(700);
    expect(point2.top).toBe(200);
    expect(point2.toCenter().x).toBe(100);
    expect(point2.toCenter().y).toBe(200);

    const point3 = Point.fromCenter({
        x: -100,
        y: -200,
        pageWidth: page.width,
        pageHeight: page.height
    })
    expect(point3.left).toBe(500);
    expect(point3.top).toBe(600);
    expect(point3.toCenter().x).toBe(-100);
    expect(point3.toCenter().y).toBe(-200);
})
