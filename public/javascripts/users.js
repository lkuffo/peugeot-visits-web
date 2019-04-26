$(document).ready(function(){

  $("#guardarusers").click(function(){
    const payload = {
      username: $("#username").val(),
      password: $("#password").val(),
      type: $("#usertype").val()
    }
    $.post("/users/new", payload, function(response){
      location.reload();
    })
  })

  $.get("/users/", function(users){
    console.log(users);
    var data = users.data;
    for (var i = 0; i < data.length; i ++){
      var registro = data[i];
      $("#usersbody").append(`
        <tr>
          <td style="text-transform: lowercase !important;"> ${registro.user} </td>
          <td style="text-transform: lowercase !important;"> ${registro.password} </td>
          <td> ${registro.type} </td>
          <td>
            <button type="button" id="${registro.user}" class="btn btn-danger btn-lg deleteuser">ELIMINAR</button>
          </td>
        </tr>
      `)
    }

    $(".deleteuser").click(function(){
      const payload = {
        username: $(this).attr("id")
      }
      console.log(payload);
      $.ajax({
        url: "/users/delete",
        type: "DELETE",
        data: payload,
        success: function(response){
          location.reload();
        }
      })
    })

    var table = $('#userstable').DataTable();
  })
})
