$(document).ready(function(){

  $("#loginmodal").modal({ show : true });

  $("#iniciarsesion").click(function(){
    $.post("/login", {
      username: $("#loginusername").val(),
      password:  $("#loginpassword").val()
    }, function(err, data){
      console.log(err);
      console.log(data);
    })
  })

});
