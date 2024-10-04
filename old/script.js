///////////////////////////////////////
// debouncing function from John Hann
///////////////////////////////////////
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

(function($,sr){
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  }
  // smartresize 
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');


///////////////////////////////
// Smooth Scroll
///////////////////////////////

smoothScroll.init();


///////////////////////////////
// Fix Header
///////////////////////////////

var $ = jQuery;

var menu = $('#navigation');

document.onscroll = function() {
  if ($(window).scrollTop() >= window.innerHeight) {
    $('#navigation').addClass('nav-wrap');
    $('#about').addClass('exp');
  } else {
    $('#navigation').removeClass('nav-wrap');
    $('#about').removeClass('exp');
  }
};


///////////////////////////////
// Experience Carousel
///////////////////////////////

$(document).ready(function() {
 
  $("#experience-container").owlCarousel({
 
      navigation : true, // Show next and prev buttons
      slideSpeed : 700,
      paginationSpeed : 400,
      singleItem : true,
  });
 
});