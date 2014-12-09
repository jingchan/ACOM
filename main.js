var app = require('./lib')();

// Create renderer and add to DOM element
app.initialize();


// Add view to the DOM
//document.body.appendChild(app.getView());
var firstChild = document.body.firstChild;
document.body.insertBefore(app.getView(), firstChild);


// Create animation loop
function animate() {
  window.requestAnimationFrame( animate );

  // Step the scene forward
  app.animateStep();
}
window.requestAnimationFrame( animate );
