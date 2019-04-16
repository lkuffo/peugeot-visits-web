$(document).ready(function(){

  $("#guardaragencias").click(function(){
    const payload = {
      nombre: $("#agencianombre").val(),
      direccion: $("#direccionnombre").val(),
    }
    $.post("/agency/new", payload, function(response){
      location.reload();
    })
  })

  $.get("/agency/", function(agencias){
    console.log(agencias);
    var data = agencias.data;
    for (var i = 0; i < data.length; i ++){
      var registro = data[i];
      $("#agenciasbody").append(`
        <tr>
          <td> ${registro.nombre} </td>
          <td> ${registro.direccion} </td>
          <td>
            <button type="button" id="${registro.nombre}" class="btn btn-danger btn-lg deleteagencia">ELIMINAR</button>
          </td>
        </tr>
      `)
    }

    $(".deleteagencia").click(function(){
      const payload = {
        nombre: $(this).attr("id")
      }
      console.log(payload);
      $.ajax({
        url: "/agency/delete",
        type: "DELETE",
        data: payload,
        success: function(response){
          location.reload();
        }
      })
    })

    var table = $('#agenciastable').DataTable();
  })
})
