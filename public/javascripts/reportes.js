var byDayData;
var byHourData;

$(document).ready(function(){

  $.get("/visits", function(data){
    var plottingData = data.data;

    $("#totalclientes").text(plottingData.length);
    var byDay = {}
    var byHour = {}
    var byCompany = {}

    for (var i = 0; i < plottingData.length; i++) {
      var register = plottingData[i];
      label = moment(register.createdAt).format("YYYY-MM-DD");
      label2 = moment(register.createdAt).format("HH | YYYY-MM-DD");
      label3 = register.agency;
      if (!(label in byDay)){
        byDay[label] = 0;
      }
      if (!(label2 in byHour)){
        byHour[label2] = 0;
      }
      if (!(label3 in byCompany)){
        byCompany[label3] = 0;
      }
      byDay[label] = byDay[label] + 1;
      byHour[label2] = byHour[label2] + 1;
      byCompany[label3] = byCompany[label3] + 1;
    }

    updateByDay(byDay);
    updateByHour(byHour);
    updateRanking(byCompany);

    $(".hm-loader-dimmer").hide();
  });

    $.get("/options/", function(opciones){
      console.log(opciones);
      var data = opciones.data;
      $("#combobox-motivo").append(`
        <option value="TODOS" selected>TODOS</option>
      `)
      for (var i = 0; i < data.length; i ++){
        var registro = data[i];
        $("#combobox-motivo").append(`
          <option value="${registro.subtype}">${registro.subtype}</option>
        `)
      }
    });

    $.get("/agency/", function(agencias){
      var data = agencias.data;
      $("#combobox-agencia").append(`
        <option value="TODOS" selected>TODAS</option>
      `)
      for (var i = 0; i < data.length; i ++){
        var registro = data[i];
        $("#combobox-agencia").append(`
          <option value="${registro.nombre}">${registro.nombre}</option>
        `)
      }
    });

    var dateFormat = "mm-dd-yy";
      from = $( "#from" )
        .datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          changeYear: true,
          dateFormat: 'mm-dd-yy',
          numberOfMonths: 1
        })
        .on( "change", function() {
          to.datepicker( "option", "minDate", getDate( this ) );
        });
      to = $( "#to" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 1,
        dateFormat: 'mm-dd-yy',
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
        var desde = moment($("#from").val(), "MM-DD-YYYY");
        var hasta = moment($("#to").val(), "MM-DD-YYYY").add(1, 'days');
        var agencia = $("#combobox-agencia").val();
        var motivo = $("#combobox-motivo").val();
        var tipovisita = $("#combobox-tipovisita").val();
        $(".hm-loader-dimmer").show();

        $.get("/visits", function(data){
          console.log($("#from").val());
          console.log(hasta);
          var plottingData = data.data.filter(function(elem){
            return (motivo === "TODOS" ? true : elem.subtype === motivo)
              && (tipovisita === "TODOS" ? true : elem.type === tipovisita)
              && (agencia === "TODOS" ? true : elem.agency === agencia)
              && ($("#from").val() === "" ? true : moment(elem.createdAt).isSameOrAfter(desde))
              && ($("#to").val() === "" ? true : moment(elem.createdAt).isSameOrBefore(hasta))
          })
          // if ($("#from").val() === "" && $("#to").val() === ""){
          //   if (motivo === "TODOS" && tipovisita === "TODOS"){
          //     var plottingData = data.data;
          //   } else {
          //     var plottingData = data.data.filter(function(elem){
          //       return elem.subtype === motivo && elem.type === tipovisita
          //     })
          //   }
          // } else {
          //   if (motivo === "TODOS" && tipovisita === "TODOS"){
          //     var plottingData = data.data.filter(function(elem){
          //       return moment(elem.createdAt).isSameOrAfter(desde) && moment(elem.createdAt).isSameOrBefore(hasta)
          //     })
          //   } else {
          //     var plottingData = data.data.filter(function(elem){
          //       return moment(elem.createdAt).isSameOrAfter(desde) && moment(elem.createdAt).isSameOrBefore(hasta) && elem.subtype === motivo && elem.type === tipovisita
          //     })
          //   }
          // }

          $("#totalclientes").text(plottingData.length);
          var byDay = {}
          var byHour = {}
          var byCompany = {}

          for (var i = 0; i < plottingData.length; i++) {
            var register = plottingData[i]
            label = moment(register.createdAt).format("YYYY-MM-DD")
            label2 = moment(register.createdAt).format("HH | YYYY-MM-DD")
            console.log(label)
            label3 = register.agency;
            if (!(label in byDay)){
              byDay[label] = 0
            }
            if (!(label2 in byHour)){
              byHour[label2] = 0
            }
            if (!(label3 in byCompany)){
              byCompany[label3] = 0;
            }
            byDay[label] = byDay[label] + 1
            byHour[label2] = byHour[label2] + 1
            byCompany[label3] = byCompany[label3] + 1;
          }

          updateByDay(byDay);
          updateByHour(byHour);
          updateRanking(byCompany);

          $(".hm-loader-dimmer").hide();
        })
    });
});

function updateRanking(byCompany){
  var sortable = [];
  for (var key in byCompany) {
      sortable.push([key, byCompany[key]]);
  }

  sortable.sort(function(a, b) {
      return b[1] - a[1];
  });
  $("#ranking2").empty();
  $("#ranking2").append(`<p style="font-size: 22px;">Ranking de Agencias</p>`)
  sortable.map(function(elem, index){
    $("#ranking2").append(`<h4 style="text-align: left; font-size: 18px !important; "> ${index+1}: \t\t ${elem[0]} | ${elem[1]} </h4>`)
  })
}

function updateByHour(byHour){
  labels = [];
  data = [];
  for (key in byHour){
    labels.push(key);
    data.push(byHour[key]);
  }
  byHourData = {
    labels: labels,
    data: data
  }
  var ctx = document.getElementById('porhora').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          borderColor: "#007edb",
          fill: false
        },
      ]
    },
    options: chartOptions(
      "Visitas por Hora",
      "Visitas",
      "Hora | Dia",
      "line"
    )
  });
}

function updateByDay(byDay){
  labels = [];
  data = [];
  for (key in byDay){
    labels.push(key);
    data.push(byDay[key]);
  }
  byDayData = {
    labels: labels,
    data: data
  }
  var ctx = document.getElementById('pordia').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          borderColor: "#007edb",
          fill: false
        },
      ]
    },
    options: chartOptions(
      "Visitas por Dia",
      "Visitas",
      "Dia",
      "line"
    )
  });
}


function chartOptions(title, y_axis, x_axis, type){
  let options = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: title,
      fontSize: 20,
      fontFamily: "Roboto",
    },
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        fontSize: 14,
        stacked: (type == "bar")? true : false,
        fontFamily: "Roboto",
        display: true,
        scaleLabel:{
          display: true,
          labelString: x_axis,
          fontSize: 16,
        },
        ticks: {
          maxRotation: 30,
          minRotation: 30
        }
      }],
      yAxes: [{
        fontFamily: "Roboto",
        display: true,
        stacked: false,
        scaleLabel:{
          display: true,
          labelString: y_axis,
          fontSize: 16,
        }
      }],
    }
  };
  return options
}

function downloadData(){
  $.get('/download', {
    byDayData,
    byHourData
  }, (err, res)=>{
    console.log("aqui");
  })
}
