$(document).ready(function() {
   $.get("/player")
   .done(function(data) {
      console.log(data);
   })
   .fail(function(err) {
      console.error(err);
   });
});
