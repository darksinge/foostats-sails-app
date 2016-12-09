$(document).ready(function() {
   var $cards = $('#connection-cards');
   $.get("/player")
   .done(function(data) {
      console.log(data);
   })
   .fail(function(err) {
      console.error(err);
   });

   var $testButton = $('#test-button');
   $testButton.click(function() {
      $("body").data("testString", "Hello World!");
      console.log('test button clicked!');
      console.log($('body').data());
   });

});
