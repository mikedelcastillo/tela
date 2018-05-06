$(window).on("load", function(){
  $slideshow = $("#slideshow");
  $slides = $slideshow.find(".slide");
  SLIDES = $slides.length;
  page = -1;

  switchSlide = function(){
    var toggle = false;
    page = (page + 1) % SLIDES;
    $slides.each(function(i, elem){
      var $e = $(elem);
      $e.removeClass("active")
      if(i == page)
        $e.addClass("active");
    });
  }

  setTimeout(function(){
    switchSlide();
    setInterval(switchSlide, 6500);
  }, 500);
});
