$(document).ready(function(){

  $("#guardarimagenes").click(function(){
    const payload = {
      url: $("#imageURL").val()
    }
    $.post("/images/new", payload, function(response){
      location.reload();
    })
  })

  $.get("/images/", function(imagenes){
    console.log(imagenes);
    var data = imagenes.data;
    for (var i = 0; i < data.length; i ++){
      var registro = data[i];
      $("#imagenesbody").append(`
        <tr>
          <td style="text-transform: lowercase !important;"> ${registro.url} </td>
          <td>
            <button type="button" id="${registro.url}" class="btn btn-danger btn-lg deleteimagen">ELIMINAR</button>
          </td>
        </tr>
      `)
    }

    $(".deleteimagen").click(function(){
      const payload = {
        url: $(this).attr("id")
      }
      console.log(payload);
      $.ajax({
        url: "/images/delete",
        type: "DELETE",
        data: payload,
        success: function(response){
          location.reload();
        }
      })
    })

    var table = $('#imagenestable').DataTable();
  })
})
