$(document).ready(function(){
    $(".hm-loader-dimmer").hide();
    // START DATE PICKER

    $.get("/options/", function(opciones){
      console.log(opciones);
      var data = opciones.data;
      for (var i = 0; i < data.length; i ++){
        var registro = data[i];
        $("#combobox-motivo").append(`
          <option value="${registro.subtype}">${registro.subtype}</option>
        `)
      }
    });

    var dateFormat = "mm-dd-yy",
      from = $( "#from" )
        .datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          changeYear: true,
          numberOfMonths: 1
        })
        .on( "change", function() {
          to.datepicker( "option", "minDate", getDate( this ) );
        }),
      to = $( "#to" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 1
      })
      .on( "change", function() {
        from.datepicker( "option", "maxDate", getDate( this ) );
      });

    function getDate( element ) {
      var date;
      try {
        date = $.datepicker.parseDate( dateFormat, element.value );
      } catch( error ) {
        date = null;
      }

      return date;
    }

    // MAPS GENERATION LOGIC

    $("#hm-filter-action").click(function(){
        var desde = $("#from").val();
        var hasta = $("#to").val();
        var range = moment.range(moment(desde), moment(hasta));
        var motivo = $("#combobox-motivo").val();
        var tipovisita = $("#combobox-tipovisita").val();
        console.log(desde);
        console.log(hasta);
        console.log(motivo);
        $(".hm-loader-dimmer").show();

        $.get("/visits", function(data){
          var plottingData = data.data.filter(function(elem){
            return range.contains(moment(elem.createdAt)) && elem.type === motivo && elem.subtype === tipovisita
          })

          $("#totalclientes").text(plottingData.length);

          console.log(data);
          $(".hm-loader-dimmer").hide();
        })
    });

});
