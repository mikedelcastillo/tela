$(document).ready(function(){
  $window = $(window);
  $wrapper = $("#lookbook");
  $pages = $wrapper.find(".page");
  $body = $(document.body);
  $pageCount = $wrapper.find("#page-count");
  $btnNext = $wrapper.find("#btn-next");
  $btnPrev = $wrapper.find("#btn-prev");
  length = $pages.length;
  currentPage = 0;
  scrollAnimation = null;
  $controls = $wrapper.find("#lookbook-controls");
  controlsTimeout = null;

  showControls = function(){
    $controls.removeClass("hidden");

    if(controlsTimeout) clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(function(){
      $controls.addClass("hidden");
    }, 3000)
  };

  $wrapper.on("mousemove", showControls);
  $wrapper.on("mousedown", showControls);

  openPage = function(page){
    currentPage = Math.max(0, Math.min(length - 1, page));

    $pageCount.text((currentPage + 1) + "/" + length);

    $pages.each(function(i, elem){
      $page = $(elem);
      var c, d = ["left", "active", "right"];
      if(page > i) c = 0;
      else if(page == i) c = 1;
      else if(page < i) c = 2;

      if($page.hasClass(d[c])){
        //do nothing cause
        //ye i respect the dom
      } else{
        $page.addClass(d[c]);

        d.splice(c, 1);
        for(var i = 0; i < d.length; i++)
          $page.removeClass(d[i]);
      }
    });

    if(scrollAnimation) scrollAnimation.stop();
    scrollAnimation = $('html, body').animate({
      scrollTop: $("#lookbook-wrapper").offset().top
    }, 500);

    showControls();
  };
  nextPage = function(){
    openPage(Math.min(length - 1, currentPage + 1));
  };

  prevPage = function(){
    openPage(Math.max(0, currentPage - 1));
  };

  $window.keydown(function(e){
    var kc = e.keyCode;
    if(kc == 39) nextPage();
    if(kc == 37) prevPage();
    if(kc == 27) location.href = "/matter/lookbook/";
  });

  $btnNext.click(nextPage);
  $btnPrev.click(prevPage);

  hm = new Hammer.Manager($wrapper.get(0), {});
  hm.add(new Hammer.Pan({
    direction: Hammer.DIRECTION_HORIZONTAL,
    threshold: 10
  }));
  hm.on("panstart", function(e){
    var d = e.direction;
    //2 = to the right
    //4 =  to the left
    if(d == 2) nextPage();
    if(d == 4) prevPage();
  });
});

$(window).load(function(){
  openPage(0);
  showControls();
});
