(function ($) {

  'use strict';

  var Mosaic = window.Mosaic = {};

  Mosaic.ScrollHandler = function () {
    var $doc = $(document);
    var $body = $(document.body);

    $(window).scroll(function() {
      if ($doc.scrollTop() > 20) {
        $body.addClass('mp-scrolled-top');
      } else {
        $body.removeClass('mp-scrolled-top');
      }
    });
  };

  Mosaic.Slideshow = function () {
    $('#mp-main-slides').slick({
      dots: true,
      autoplay: true,
      autoplaySpeed: 7000,
      arrows: false
    });
  };

  Mosaic.ScrollHandler();
  Mosaic.Slideshow();
})(window.jQuery);


