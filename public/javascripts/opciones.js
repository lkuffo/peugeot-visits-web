$(document).ready(function(){

  $("#guardaropciones").click(function(){
    const payload = {
      type: $("#opcionType").val(),
      subtype: $("#opcionSubtype").val()
    }
    $.post("/options/new", payload, function(response){
      location.reload();
    })
  })

  $.get("/options/", function(opciones){
    console.log(opciones);
    var data = opciones.data;
    for (var i = 0; i < data.length; i ++){
      var registro = data[i];
      $("#opcionesbody").append(`
        <tr>
          <td> ${registro.type} </td>
          <td> ${registro.subtype} </td>
          <td>
            <button type="button" id="${registro.subtype}" class="btn btn-danger btn-lg deleteopcion">ELIMINAR</button>
          </td>
        </tr>
      `)
    }

    $(".deleteopcion").click(function(){
      const payload = {
        subtype: $(this).attr("id")
      }
      console.log(payload);
      $.ajax({
        url: "/options/delete",
        type: "DELETE",
        data: payload,
        success: function(response){
          location.reload();
        }
      })
    })

    var table = $('#opcionestable').DataTable();
  })
})
