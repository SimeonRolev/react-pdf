export const ZOOM_STEP = 0.1;
export const MIN_PDF_SCALE = 0.2;
export const MAX_PDF_SCALE = 12;

export class Mode {
    static NORMAL = {
        name: 'normal',
        cursor: 'default'
    };
    static ZOOM_IN = {
        name: 'zoom-in',
        cursor: 'zoom-in'
    };
    static ZOOM_OUT = {
        name: 'zoom-out',
        cursor: 'zoom-out'
    };
    static PAN = {
        name: 'pan',
        cursor: 'grab'
    };
}