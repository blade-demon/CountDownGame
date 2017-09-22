hopscotch.registerHelper('addOverlay', function() {
  $('body').append('<div class="overlay"></div>');
});

hopscotch.registerHelper('removeOverlay', function() {
  $('.overlay').fadeOut(function(){
    $(this).remove();
    $('.helper').remove();
  });
});

hopscotch.listen('show', function(){
  var elementObject = $(hopscotch.getCurrTarget(tour));
  var element = $('#'+elementObject[0].id);
  
  element.prev().removeClass('overlay-relative');
  element.addClass('overlay-relative');
  
  if($('.helper').length !== 0){
    
    // Use Helper Layer for hilight target element.
    var helper = $('.helper');
    var padding = 0;
    var helperPosX = element.position().left - padding;
    var helperPosY = element.position().top - padding;
    var targetWidth = element.outerWidth();
    var targetHeight = element.outerHeight();

    console.log('PositionX : '+helperPosX+' PositionY : '+helperPosY);
    console.log('TargetWidth : '+targetWidth+' TargetHeight : '+targetHeight);

    helper.css('width',targetWidth) ;
    helper.css('height',targetHeight);
    helper.offset({left:helperPosX,top:helperPosY});
    
  }else{
    
    // Add Helper Layer for highlight target element.
    var newHelper = '<div class="helper"></div>';
    $('body').append(newHelper);
   
    var helper = $('.helper');
    var padding = 5;
    var helperPosX = element.position().left - padding;
    var helperPosY = element.position().top - padding;
    var targetWidth = element.outerWidth();
    var targetHeight = element.outerHeight();

    console.log('PositionX : '+helperPosX+' PositionY : '+helperPosY);
    console.log('TargetWidth : '+targetWidth+' TargetHeight : '+targetHeight);

    helper.css('width',targetWidth + 10) ;
    helper.css('height',targetHeight + 10);
    helper.offset({left:helperPosX,top:helperPosY});
  }
  
});


var tour = {
  id: "hello-hopscotch",
  showCloseButton : false,
  steps: [
    {
      title: "",
      content: "",
      target: "basketballImg",
      placement: "top",
      zindex: 999999,
      yOffset: 5,
      onNext: function() {
        $('#step1').removeClass('overlay-relative');
        $('.helper').remove();
      }
    }
  ],
  onStart: ["addOverlay"],
  onEnd: ["removeOverlay"],
};

hopscotch.startTour(tour);

$(".tour-hello-hopscotch").remove();