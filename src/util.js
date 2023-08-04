import { MAX_PDF_SCALE, MIN_PDF_SCALE } from "./constants";

/*
Scale only the visible pages
*/
function isElementInViewport(el) {
  if (!el) return false;
  var rect = el.getBoundingClientRect();

  return rect.bottom > 0 &&
    rect.right > 0 &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */ &&
    rect.top < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */;
}

export function detectMouseWheelDirection(e) {
  var delta = null, direction = false;
  if (!e) { // if the event is not provided, we get it from the window object
    e = window.event;
  }
  if (e.wheelDelta) { // will work in most cases
    delta = e.wheelDelta / 60;
  } else if (e.detail) { // fallback for Firefox
    delta = -e.detail / 2;
  }
  if (delta !== null) {
    direction = delta > 0 ? 'up' : 'down';
  }

  return direction;
}

export function isScaleValid(value) {
  return value < MAX_PDF_SCALE && value > MIN_PDF_SCALE
}