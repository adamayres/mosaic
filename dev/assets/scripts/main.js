(function ($) {

  'use strict';

  var Mosaic = window.Mosaic = {};

  Mosaic.ScrollHandler = function () {
    //var $doc = $(document);
    var $mainNav = $('#mp-main-nav');
    var $body = $(document.body);
    //
    //$(window).scroll(function() {
    //  if ($doc.scrollTop() > 50) {
    //    $body.addClass('scrolled-top');
    //  } else {
    //    $body.removeClass('scrolled-top');
    //  }
    //});

    $mainNav
      .on('affix.bs.affix', function () {
        $body.addClass('mp-scrolled-top');
      })
      .on('affix-top.bs.affix', function () {
        $body.removeClass('mp-scrolled-top');
      });
  };

  Mosaic.ScrollHandler();
})(window.jQuery);


