$(document).ready(function(){
  ANIMATION_INTERVAL = 50;
});

$(window).load(function(){
  $wrapper = $("#designs-wrapper");
  $designs = $wrapper.find(".design");
  $thumbs = $("#thumbs-wrapper .thumb");
  $body = $(document.body);
  $current = null;
  $itemSize = $("#item-size");
  $btnSizeChart = $("#btn-size-chart");
  $sizeChart = $("#size-chart-wrapper");
  length = $designs.length;

  $btnSizeChart.click(function(){
    $sizeChart.addClass("active");
    $sizeChart.one("mousedown", function(){
      $sizeChart.removeClass("active");
    });
  });

  $thumbs.each(function(i, elem){
    $(elem).click(function(){
      selectPreview(i);
    });
  });

  selectPreview = function(n){
    n = Math.max(0, Math.min(length - 1, n));
    $designs.removeClass("active");
    $thumbs.removeClass("active");

    $current = $($designs[n]);
    $itemSize.text($current.data("item-size"));
    $current.addClass("active");
    $($thumbs[n]).addClass("active");
  };

  selectPreview(0);

  hm = new Hammer.Manager($wrapper.get(0), {});

  hm.add(new Hammer.Pan({
    direction: Hammer.DIRECTION_ALL,
    threshold: 10
  }));

  relativizePoint = function(point){
    var offset = $wrapper.offset();
    var width = $wrapper.width();
    var height = $wrapper.height();
    point.x -= offset.left;
    point.y -= offset.top;
    point.x += $body.scrollLeft();
    point.y += $body.scrollTop();
    point.x = Math.max(0, Math.min(point.x, width));
    point.y = Math.max(0, Math.min(point.y, height));
    point.x /= width;
    point.y /= height;
    return point;
  };

  zoomPreview = function(point){
    var scale = 5;
    var x = point.x * 100;
    var y = point.y * 100;
    $current.css({
      backgroundSize: scale * 100 + "%",
      backgroundPosition: x + "% " + y + "%",
    });
  };

  endZoom = function(){
    $current.css({
      backgroundSize: "cover",
      backgroundPosition: "center" ,
    });
  };

  $wrapper.on("mousemove", function(e){
    var point = relativizePoint({
      x: e.clientX,
      y: e.clientY
    });
    zoomPreview(point);
  });

  hm.on("panmove", function(e){
    var point = relativizePoint(e.center);
    zoomPreview(point);
  });

  hm.on("panend", endZoom);
  $wrapper.on("mouseout", endZoom);

  $wrapper.on("touchstart", function(e){
    var touch = e.originalEvent.touches[0];
    var point = relativizePoint({
      x: touch.clientX,
      y: touch.clientY
    });
    zoomPreview(point);
  });

  $wrapper.on("touchend", function(e){
    endZoom();
  });
});
