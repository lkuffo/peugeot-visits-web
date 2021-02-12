var plainData;
var byDayData;
var byHourData;
var byAgencyData;
var bySubtypeData;
var byTypeData;
var chartByDay;
var chartByHour;
var chartByAgency;
var chartByType;
var chartBySubtype1;
var chartBySubtype2;

var chartColors = [
	'rgb(255, 99, 132)',
	'rgb(255, 159, 64)',
	'rgb(255, 205, 86)',
	'rgb(75, 192, 192)',
	'rgb(54, 162, 235)',
	'rgb(153, 102, 255)',
	'rgb(201, 203, 207)'
]

$(document).ready(function(){

  $("#hm-donwload-excel").click(function(){
    downloadData();
  })

  $("#hm-donwload-special-excel").click(function(){
    downloadSpecialData();
  })

  $("#hm-donwload-plain-excel").click(function(){
    downloadPlainData();
  })

  var desdePivote = moment().subtract(1, 'month');
  var hastaPivote = moment().add(1, 'days');
  $("#from").val(desdePivote.format("MM-DD-YYYY"));
  $("#to").val(hastaPivote.format("MM-DD-YYYY"));

  $.get("/visits", function(data){
    var plottingData = data.data.filter(function(elem){
      return moment(elem.createdAt).isSameOrAfter(desdePivote) 
        && moment(elem.createdAt).isSameOrBefore(hastaPivote);
    });
    $("#totalclientes").text(plottingData.length);
    var byDay = {}
    var byHour = {}
    var byCompany = {}
    var byAgencySpecial = {}
    var byTypeSpecial = {}
    var bySubtypeSpecial = {}
    plainData = plottingData;

    for (var i = 0; i < plottingData.length; i++) {
      var register = plottingData[i];
      if (!register.agency){
        continue;
      }
      label = moment(register.createdAt).format("YYYY-MM-DD");
      label2 = moment(register.createdAt).format("HH | YYYY-MM-DD");
      label3 = register.agency;
      if (!(label in byDay)){
        byDay[label] = 0;
      }
      if (!(label2 in byHour)){
        byHour[label2] = 0;
      }
      if (!(label in byTypeSpecial)){
        byTypeSpecial[label] = {}
      }
      if (!(label in byAgencySpecial)){
        byAgencySpecial[label] = {}
      }
      if (!(label3 in byCompany)){
        byCompany[label3] = 0;
      }
      byDay[label] = byDay[label] + 1;
      byHour[label2] = byHour[label2] + 1;
      byCompany[label3] = byCompany[label3] + 1;

      agencyLabel = register.agency;
      if (!(agencyLabel in byAgencySpecial[label])){
        byAgencySpecial[label][agencyLabel] = 0;
      }
      byAgencySpecial[label][agencyLabel] += 1;

      typeLabel = register.type;
      if (!(typeLabel in byTypeSpecial[label])){
        byTypeSpecial[label][typeLabel] = 0;
      }
      byTypeSpecial[label][typeLabel] += 1;

      if (!(typeLabel in bySubtypeSpecial)){
        bySubtypeSpecial[typeLabel] = {};
      }
      if (!(label in bySubtypeSpecial[typeLabel])){
        bySubtypeSpecial[typeLabel][label] = {}
      }
      var subTypeLabel = register.subtype;
      if (!(subTypeLabel in bySubtypeSpecial[typeLabel][label])){
        bySubtypeSpecial[typeLabel][label][subTypeLabel] = 0;
      }

      bySubtypeSpecial[typeLabel][label][subTypeLabel] += 1;
    }

    updateByDay(byDay);
    updateByHour(byHour);
    updateRanking(byCompany);
    updateByAgency(byAgencySpecial);
    updateByType(byTypeSpecial);
    updateBySubType(bySubtypeSpecial)

    $(".hm-loader-dimmer").hide();
  });

    $.get("/options/", function(opciones){
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
          var byAgencySpecial = {}
          var byTypeSpecial = {}
          var bySubtypeSpecial = {}
          plainData = plottingData;

          for (var i = 0; i < plottingData.length; i++) {
            var register = plottingData[i]
            if (!register.agency){
              continue;
            }
            label = moment(register.createdAt).format("YYYY-MM-DD")
            label2 = moment(register.createdAt).format("HH | YYYY-MM-DD")
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
            if (!(label in byTypeSpecial)){
              byTypeSpecial[label] = {}
            }
            if (!(label in byAgencySpecial)){
              byAgencySpecial[label] = {}
            }
            byDay[label] = byDay[label] + 1
            byHour[label2] = byHour[label2] + 1
            byCompany[label3] = byCompany[label3] + 1;

            agencyLabel = register.agency;
            if (!(agencyLabel in byAgencySpecial[label])){
              byAgencySpecial[label][agencyLabel] = 0;
            }
            byAgencySpecial[label][agencyLabel] += 1;
      
            typeLabel = register.type;
            if (!(typeLabel in byTypeSpecial[label])){
              byTypeSpecial[label][typeLabel] = 0;
            }
            byTypeSpecial[label][typeLabel] += 1;
      
            if (!(typeLabel in bySubtypeSpecial)){
              bySubtypeSpecial[typeLabel] = {};
            }
            if (!(label in bySubtypeSpecial[typeLabel])){
              bySubtypeSpecial[typeLabel][label] = {}
            }
            var subTypeLabel = register.subtype;
            if (!(subTypeLabel in bySubtypeSpecial[typeLabel][label])){
              bySubtypeSpecial[typeLabel][label][subTypeLabel] = 0;
            }
      
            bySubtypeSpecial[typeLabel][label][subTypeLabel] += 1;

          }

          updateByDay(byDay);
          updateByHour(byHour);
          updateRanking(byCompany);
          updateByAgency(byAgencySpecial);
          updateByType(byTypeSpecial);
          updateBySubType(bySubtypeSpecial);

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

function updateByAgency(byAgency){
  labels = [];
  datasets = {};
  totalDays = Object.keys(byAgency).length;
  Object.keys(byAgency).map((key, posicion) => {
    labels.push(key);
    for (agencia in byAgency[key]){
      if (!(agencia in datasets)){
        datasets[agencia] = Array(totalDays).fill(0);
      }
      datasets[agencia][posicion] = byAgency[key][agencia];
    }
  });
  var ctx = document.getElementById('poragencia').getContext('2d');
  if (chartByAgency){
    chartByAgency.destroy();
  }
  chartByAgency = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: Object.keys(datasets).map((datasetKey, i) => {
        const dataset = datasets[datasetKey];
        const color = chartColors[i % 7];
        return {
          label: datasetKey,
          borderColor: color,
          backgroundColor: color,
          data: dataset,
          fill: false
        }
      })
    },
    options: chartOptions(
      ["Visitas por Dia por Agencia", "(da click en la leyenda para ocultar y mostrar las agencias)"],
      "Visitas",
      "Dia",
      "line"
    )
  });
  byAgencyData = byAgency;
}

function updateBySubType(bySubType){
  let {
    posventa,
    vehiculo
  } = bySubType

  if (posventa){
    labels1 = [];
    datasets1 = {};
    totalDays = Object.keys(posventa).length;
    Object.keys(posventa).map((key, posicion) => {
      labels1.push(key);
      for (tipo in posventa[key]){
        if (!(tipo in datasets1)){
          datasets1[tipo] = Array(totalDays).fill(0);
        }
        datasets1[tipo][posicion] = posventa[key][tipo];
      }
    });
    var ctx = document.getElementById('porsubtipo1').getContext('2d');
    if (chartBySubtype1){
      chartBySubtype1.detroy();
    }
    chartBySubtype1 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels1,
        datasets: Object.keys(datasets1).map((datasetKey, i) => {
          const dataset = datasets1[datasetKey];
          const color = chartColors[i % 7]
          return {
            label: datasetKey,
            borderColor: color,
            backgroundColor: color,
            data: dataset,
            fill: false
          }
        })
      },
      options: chartOptions(
        "Tipo de Visitas por Posventa",
        "Visitas",
        "Dia",
        "line"
      )
    });
  } else {
    if (chartBySubtype1){
      chartBySubtype1.destroy()
    }
  }

  if (vehiculo){
    labels2 = [];
    datasets2 = {};
    totalDays = Object.keys(vehiculo).length;
    Object.keys(vehiculo).map((key, posicion) => {
      labels2.push(key);
      for (tipo in vehiculo[key]){
        if (!(tipo in datasets2)){
          datasets2[tipo] = Array(totalDays).fill(0);
        }
        datasets2[tipo][posicion] = vehiculo[key][tipo];
      }
    });
    var ctx = document.getElementById('porsubtipo2').getContext('2d');
    if (chartBySubtype2){
      chartBySubtype2.destroy();
    }
    chartBySubtype2 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels2,
        datasets: Object.keys(datasets2).map((datasetKey, i) => {
          const dataset = datasets2[datasetKey];
          const color = chartColors[i % 7]
          return {
            label: datasetKey,
            borderColor: color,
            backgroundColor: color,
            data: dataset,
            fill: false
          }
        })
      },
      options: chartOptions(
        "Tipo de Visitas por Vehiculo",
        "Visitas",
        "Dia",
        "line"
      )
    });
  } else {
    if (chartBySubtype2){
      chartBySubtype2.destroy()
    }
  }

  bySubtypeData = bySubType;
}

function updateByType(byType){
  labels = [];
  datasets = {};
  totalDays = Object.keys(byType).length;
  Object.keys(byType).map((key, posicion) => {
    labels.push(key);
    for (tipo in byType[key]){
      if (!(tipo in datasets)){
        datasets[tipo] = Array(totalDays).fill(0);
      }
      datasets[tipo][posicion] = byType[key][tipo];
    }
  });
  var ctx = document.getElementById('portipo').getContext('2d');
  if (chartByType){
    chartByType.destroy();
  }
  chartByType = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: Object.keys(datasets).map((datasetKey, i) => {
        const dataset = datasets[datasetKey];
        const color = chartColors[i % 7]
        return {
          label: datasetKey,
          borderColor: color,
          backgroundColor: color,
          data: dataset,
          fill: false
        }
      })
    },
    options: chartOptions(
      "Tipo de Visitas por Dia",
      "Visitas",
      "Dia",
      "line"
    )
  });
  byTypeData = byType;
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
  if (chartByHour){
    chartByHour.destroy();
  }
  chartByHour = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          label: 'Visitas',
          borderColor: chartColors[Math.floor(Math.random() * chartColors.length)],
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
  if (chartByDay){
    chartByDay.destroy();
  }
  chartByDay = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          label: 'Visitas',
          borderColor: chartColors[Math.floor(Math.random() * chartColors.length)],
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
      display: true
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
  $.post('/download', {
    data: JSON.stringify({
      byDayData: byDayData,
      byHourData: byHourData
    })
  }, (res)=>{
    if (res && res.fileName){
      window.open(`/download?filename=${res.fileName}`);
      return;
    }
    alert('Sucedio un error inesperado');
  })
}

function downloadSpecialData(){
  $.post('/download/special', {
    data: JSON.stringify({
      byAgencyData,
      byTypeData,
      bySubtypeData
    })
  }, (res)=>{
    if (res && res.fileName){
      window.open(`/download/special?filename=${res.fileName}`);
      return;
    }
    alert('Sucedio un error inesperado');
  })
}

function downloadPlainData(){
  $.post('/download/plain', {
    data: JSON.stringify({
      plainData
    })
  }, (res)=>{
    if (res && res.fileName){
      window.open(`/download/plain?filename=${res.fileName}`);
      return;
    }
    alert('Sucedio un error inesperado');
  })
}
