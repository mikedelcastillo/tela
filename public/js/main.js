var ANIMATION_INTERVAL = 100;

$(document).ready(function(){
  FastClick.attach(document.body);

  $navWrapper = $("#nav-wrapper");
  $navGroups = $navWrapper.find(".nav-main-group");

  $navGroups.on("touchstart", function(e){
    $this = $(this);
    if($this.hasClass("has-sub")){
      if($this.hasClass("show-drop")){

        e.stopPropagation();
      } else{
        $this.addClass("show-drop");
        $(document.body).one("touchstart click", function(){
          $this.removeClass("show-drop");
        });

        e.preventDefault();
        return false;
      }
    }
  });
});

$(window).on("load", function(){
  $("#loading-wrapper").fadeOut(200);
  setTimeout(function(){
    $(".pre-animation").each(function(i, elem){
      setTimeout(function(){
        $(elem).removeClass("pre-animation");
      }, ANIMATION_INTERVAL * i);
    })
  }, 200);
});
