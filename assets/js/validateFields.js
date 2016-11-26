function validateFields() {
   var canSubmit = true;
   var field = document.forms["form"]["firstName"].value;
   if (field == "" || null) {
      document.getElementById("fn").innerHTML = "first name*"
      document.getElementById("fn").className = "text-danger";
      canSubmit = false;
   }
   field = document.forms["form"]["lastName"].value
   if (field == "" || null) {
      document.getElementById("ln").innerHTML = "last name*"
      document.getElementById("ln").className = "text-danger";
      canSubmit = false;
   }

   field = document.forms["form"]["email"].value
   if (field == "" || null) {
      document.getElementById("em").innerHTML = "email*"
      document.getElementById("em").className = "text-danger";
      canSubmit = false;
   }

   if (!canSubmit) document.getElementById("panel-message").innerHTML = 'You must fill out all fields*';

   return canSubmit;
}
