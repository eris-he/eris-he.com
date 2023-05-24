const cmSliderWrapper = document.querySelector(".cm-slider__wrapper");
const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;
const getWindowHeight = () => window.innerHeight || document.documentElement.clientHeight;
const getWidthAdjustment = () => (getWindowWidth() - cmSliderWrapper.offsetWidth) / 2
//const isTouchScreenOnly = () => ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
const isTouchScreenOnly = () => !window.matchMedia("(hover: hover)").matches;
cmSliderWrapper.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    cmSliderWrapper.scrollLeft += evt.deltaY;
    cmSliderWrapper.scrollLeft += evt.deltaX;
})
cmSliderWrapper.onmousemove = e => {
    if(isTouchScreenOnly()) return;
    let percentage = ((e.clientX - getWidthAdjustment()) / cmSliderWrapper.offsetWidth) * 100;
    percentage = percentage > 100 ? 100 : percentage < 0 ? 0 : percentage;
    let cmSlider = document.querySelector(".cm-slider");
    //cmSliderWrapper.dataset.percentage = percentage;
    
    //cmSlider.style.transform = `translate(${-percentage}%, -50%)`;
    let animateDuration = 800;
    if(typeof userTabbed !== "undefined" && userTabbed){
        animateDuration = 300;
        userTabbed = false;
    }
    cmSlider.animate({
        transform: `translateX(${-percentage}%, -50%)`
        // transform: `translate(${-percentage}%, -50%)`
    },{
        duration:animateDuration, fill:"forwards"
    });
    for(const image of cmSlider.getElementsByClassName("cm-slider__image")){
        //image.style.objectPosition = `${percentage}% center`;
        image.animate({
            objectPosition: `${percentage}% center`
        },{
            duration:animateDuration, fill:"forwards"
        });
    }
    if(typeof nudgeSliderScrollPosition !== "undefined" && nudgeSliderScrollPosition) nudgeSliderScrollPosition();
}

const isInViewport = rect => (
    rect.top >= -rect.height &&
    rect.left >= -rect.width &&
    rect.bottom <= getWindowHeight() + rect.height &&
    rect.right <= getWindowWidth() + rect.width
);
cmSliderWrapper.addEventListener("scroll", () => {
    if(!isTouchScreenOnly()) return;
    let cmSlider = document.querySelector(".cm-slider");
    for(const image of cmSlider.getElementsByClassName("cm-slider__image")){
        let rect = image.getBoundingClientRect();
        if( isInViewport(rect) ){
            let percentage = ((rect.x + rect.width) / (getWindowWidth() + rect.width)) * 100;
            image.style.objectPosition = `${percentage}% center`;
        }
    }
});
cmSliderWrapper.dispatchEvent(new Event("scroll")); // fire event manually to trigger objectPosition calculation for images
let wasTouchScreenOnly = isTouchScreenOnly(); // this code is used mainly to reset animations when turning on/off device emulation with Chrome DevTools
window.addEventListener("resize", () => {
    if(wasTouchScreenOnly && isTouchScreenOnly()) return; // do nothing if resizing device screen on mobile
    wasTouchScreenOnly = isTouchScreenOnly(); // update current device state
    if(!isTouchScreenOnly()) return; // do nothing if resizing screen on non-mobile devices
    // replace cmSlider with its clone when transitioning from desktop to mobile to reset any animations applied previously
    let cmSlider = document.querySelector(".cm-slider");
    cmSlider.parentNode.replaceChild(cmSlider.cloneNode(true), cmSlider);
});

let prevActiveElement = document.activeElement;
let userTabbed = false; // we use this to reduce animation time on the cmSlider to prevent jankiness on desktop animation.
let userMouseDown = 0; // we use this to track when the user clicks and releases the mouse.
const onFocusChange = () => {
    //if(isTouchScreenOnly()) return; // this code deals with tabbed navigation using a keyboard on desktop view. Ignore mobile devices.
    if(userMouseDown > 0) return; // ignore focus event if mouse has been clicked
    let currentActiveElement = document.activeElement;
    if(prevActiveElement === currentActiveElement) return; // ignore if we have already done this, since we are listening to both focus and blur events
    prevActiveElement = currentActiveElement; // update previous active element
    // if(!currentActiveElement.classList.contains("cm-slider__link")) return;
    if(isTouchScreenOnly()){
        currentActiveElement.scrollIntoView({
            behavior: "auto",
            block: "center",
            inline: "center"
        });
        return;
    }
    userTabbed = true; // this variable is used on desktop only
    const siblingCount = currentActiveElement.parentElement.children.length;
    //const currentIndex = Array.from(currentActiveElement.parentElement.children).indexOf(currentActiveElement);
    const currentIndex = parseInt(currentActiveElement.dataset.slideIndex);
    const sliderWidth = cmSliderWrapper.offsetWidth;
    const calcX = getWidthAdjustment() + ((currentIndex + 0.5)*(sliderWidth/siblingCount));
    const calcY = getWindowHeight()/2;
    //console.log(`x:${calcX} y:${calcY}`);
    cmSliderWrapper.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center"
    });
    cmSliderWrapper.dispatchEvent(new MouseEvent(
        "mousemove",
        {
            "view": window,
            "bubbles": true,
            "clientX": calcX,
            "clientY": calcY,
        }
    ));
}
window.addEventListener("focus", onFocusChange, true);
window.addEventListener("blur", onFocusChange, true);

const onMouseDown =() => {
    userMouseDown++;
}
const onMouseUp = () => {
    userMouseDown--;
}
const onKeyDown = (e) => {
    if(e.keyCode === 9) userMouseDown = 0; // if user pressed tab, reset userMouseDown to 0
}
window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mouseup", onMouseUp);
window.addEventListener("keydown", onKeyDown);

//Possibly comment this out
const getScrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
/*let prevScrollPosition = getScrollPosition();
let scrollDirection = 0; // set to 1 for scrolling down, -1 for scrolling up
const updateScrollDirection = () => {
    let currentScrollPosition = getScrollPosition();
    scrollDirection = currentScrollPosition > prevScrollPosition ? 1 : -1;
    prevScrollPosition = currentScrollPosition;
}
window.addEventListener("scroll", updateScrollDirection);//*/
const nudgeSliderScrollPosition = () => {
    if(isTouchScreenOnly()) return;
    let rect = cmSliderWrapper.getBoundingClientRect();
    if(!isInViewport(rect)) return;
    const percentageInViewport = 0.33;
    const nudgeRange = rect.height * percentageInViewport;
    if(Math.abs(rect.top) > nudgeRange) return;
    if(scrollDirection === 1 && rect.top + (nudgeRange/2) < 0) return; // don't nudge if we are scrolling downwards to leave the slider
    if(scrollDirection === -1 && rect.bottom - (nudgeRange/2) > rect.height) return; // don't nudge if we are scrolling upwards to leave the slider
    let distance = rect.top / 10;
    const currentScrollPosition = getScrollPosition();
    window.scrollBy({
        top: distance,
        behavior: "instant"
    });
    if(currentScrollPosition === getScrollPosition()){
        cmSliderWrapper.scrollIntoView({
            behavior: "instant",
            block: "center",
            inline: "center"
        });
    }
}


const boxes = document.querySelectorAll(".cm-slider__image")
const container = document.querySelector(".cm-slider__link")

const shrink = (e) => {
    const el = e.target;
    // const del = document.getElementsByClassName("full-screen");
    // const el = del[0];

    // Remove cloned element from DOM after animation is over
    el.addEventListener("animationend", (e) => e.target.remove())

    // Trigger browser reflow to start animation
    el.style.animation = 'none';
    el.offsetHeight
    el.style.animation = ''
    el.classList.add("shrink-down")

    boxes.forEach(box => {
        box.addEventListener("click", toggleFullScreen)
    })
    restoreBlur();
}

const toggleFullScreen = (e) => {
  // Get position values for element
  const {
    top,
    left
  } = e.target.getBoundingClientRect()

  // Clone the element and its children
  let fullScreen = e.target.cloneNode(true)
  blurExceptElement(fullScreen);

  // Set top and left with custom property
  //fullScreen.style.setProperty("--inset", `0 auto auto auto`)

  // Add class with animation and position
  fullScreen.classList.add("full-screen")

  // Listen for click to close full screen
  fullScreen.addEventListener("click", shrink)

  // Place in container over element to expand
  container.appendChild(fullScreen)

  boxes.forEach(box => {
    box.removeEventListener("click", toggleFullScreen)
  });
}

// Add click listeners on all boxes
boxes.forEach(box => {
  box.addEventListener("click", toggleFullScreen)
})

function blurExceptElement(element) {
    var container = document.getElementsByClassName("cm-slider__image");
    // var elementsToBlur = Array.from(container.children).filter(function(child) {
    //   return child !== element;
    // });
    Array.from(container).forEach(function(child) {
        child.style.filter = 'blur(5px)';
    });
    element.style.filter = 'none'
}
  
  function restoreBlur() {
    var container = document.getElementsByClassName("cm-slider__image");
    // var elementsToRestore = Array.from(container.children).filter(function(child) {
    //     return child !== element;
    //   });
    //container.style.filter = 'none';
  
    Array.from(container).forEach(function(child) {
        child.style.filter = 'none';
    });
  }
  