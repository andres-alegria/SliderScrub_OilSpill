// looking for a non-scrubbing version? https://codepen.io/GreenSock/pen/QWYdgjG

let frameCount = 13,
    urls = [
  "https://imgs.mongabay.com/wp-content/uploads/sites/20/2026/01/14163725/2026_001_AA_OilSpill_v4_1-scaled.jpg",
  "https://imgs.mongabay.com/wp-content/uploads/sites/20/2026/01/14163731/2026_001_AA_OilSpill_v4_2-scaled.jpg",
  "hhttps://imgs.mongabay.com/wp-content/uploads/sites/20/2026/01/14163738/2026_001_AA_OilSpill_v4_3-scaled.jpg",
  "https://imgs.mongabay.com/wp-content/uploads/sites/20/2026/01/14163745/2026_001_AA_OilSpill_v4_4-scaled.jpg",
  "https://imgs.mongabay.com/wp-content/uploads/sites/20/2026/01/14163751/2026_001_AA_OilSpill_v4_5-scaled.jpg",
  "https://imgs.mongabay.com/wp-content/uploads/sites/20/2026/01/14163758/2026_001_AA_OilSpill_v4_6-scaled.jpg",
  "https://imgs.mongabay.com/wp-content/uploads/sites/20/2026/01/14163805/2026_001_AA_OilSpill_v4_7-scaled.jpg",
  "https://imgs.mongabay.com/wp-content/uploads/sites/20/2026/01/14163812/2026_001_AA_OilSpill_v4_8-scaled.jpg",
  "https://imgs.mongabay.com/wp-content/uploads/sites/20/2026/01/14163817/2026_001_AA_OilSpill_v4_9-scaled.jpg",
  "https://imgs.mongabay.com/wp-content/uploads/sites/20/2026/01/14163823/2026_001_AA_OilSpill_v4_10-scaled.jpg",
  "https://imgs.mongabay.com/wp-content/uploads/sites/20/2026/01/14163830/2026_001_AA_OilSpill_v4_11-scaled.jpg",
  "https://imgs.mongabay.com/wp-content/uploads/sites/20/2026/01/14163836/2026_001_AA_OilSpill_v4_12-scaled.jpg",
  "https://imgs.mongabay.com/wp-content/uploads/sites/20/2026/01/14163843/2026_001_AA_OilSpill_v4-13-scaled.jpg",
];

imageSequence({
  urls, // Array of image URLs
  canvas: "#image-sequence", // <canvas> object to draw images to
  //clear: true, // only necessary if your images contain transparency
  //onUpdate: (index, image) => console.log("drew image index", index, ", image:", image),
  scrollTrigger: {
    start: 2,   // start at the very top
    end: "max", // entire page
    scrub: true, // important!
  }
});


/*
Helper function that handles scrubbing through a sequence of images, drawing the appropriate one to the provided canvas. 
Config object properties: 
- urls [Array]: an Array of image URLs
- canvas [Canvas]: the <canvas> object to draw to
- scrollTrigger [Object]: an optional ScrollTrigger configuration object like {trigger: "#trigger", start: "top top", end: "+=1000", scrub: true, pin: true}
- clear [Boolean]: if true, it'll clear out the canvas before drawing each frame (useful if your images contain transparency)
- paused [Boolean]: true if you'd like the returned animation to be paused initially (this isn't necessary if you're passing in a ScrollTrigger that's scrubbed, but it is helpful if you just want a normal playback animation)
- fps [Number]: optional frames per second - this determines the duration of the returned animation. This doesn't matter if you're using a scrubbed ScrollTrigger. Defaults to 30fps.
- onUpdate [Function]: optional callback for when the Tween updates (probably not used very often). It'll pass two parameters: 1) the index of the image (zero-based), and 2) the Image that was drawn to the canvas

Returns a Tween instance
*/
function imageSequence(config) {
  let playhead = {frame: 0},
      canvas = gsap.utils.toArray(config.canvas)[0] || console.warn("canvas not defined"),
      ctx = canvas.getContext("2d"),
      curFrame = -1,
      onUpdate = config.onUpdate,
      images,
      updateImage = function() {
        let frame = Math.round(playhead.frame);
        if (frame !== curFrame) { // only draw if necessary
          config.clear && ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(images[Math.round(playhead.frame)], 0, 0);
          curFrame = frame;
          onUpdate && onUpdate.call(this, frame, images[frame]);
        }
      };
  images = config.urls.map((url, i) => {
    let img = new Image();
    img.src = url;
    i || (img.onload = updateImage);
    return img;
  });
  return gsap.to(playhead, {
    frame: images.length - 1,
    ease: "none",
    onUpdate: updateImage,
    duration: images.length / (config.fps || 30),
    paused: !!config.paused,
    scrollTrigger: config.scrollTrigger
  });
}