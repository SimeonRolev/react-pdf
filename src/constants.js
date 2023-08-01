export const ZOOM_STEP = 0.1;
export const MAX_PDF_SCALE = 8;
export const MAX_CSS_SCALE = 25;

export class Mode {
    static NORMAL = {
        name: 'normal',
        cursor: 'normal'
    };
    static ZOOM_IN = {
        name: 'zoom-in',
        cursor: 'zoom-in'
    };
    static ZOOM_OUT = {
        name: 'zoom-out',
        cursor: 'zoom-out'
    };
}