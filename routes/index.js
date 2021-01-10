/**
 * Router for the InterMine Registry Front End endpoints.
 */
var express = require('express');
var router = express.Router();
var moment = require('moment');
var passport = require('passport');
var path = require('path');
var ExcelJS = require('exceljs');
var fs = require('fs');
var TARGET_PATH = path.resolve(__dirname, '../reports/');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (typeof req.user === "undefined"){
    return res.render('login');
  }
  res.render('reportes', { title: 'Reportes', active: "reportes", user: req.user });
});

/* GET home page. */
router.get('/opciones', function(req, res, next) {
  if (typeof req.user === "undefined"){
    return res.render('login');
  }
  res.render('opciones', { title: 'Opciones de Visita', active: "opciones", user: req.user  });
});

/* GET home page. */
router.get('/usuarios', function(req, res, next) {
  if (typeof req.user === "undefined"){
    return res.render('login');
  }
  res.render('usuarios', { title: 'Usuarios', active: "usuarios", user: req.user  });
});

/* GET home page. */
router.get('/agencias', function(req, res, next) {
  if (typeof req.user === "undefined"){
    return res.render('login');
  }
  res.render('agencias', { title: 'Agencias', active: "agencias", user: req.user  });
});

router.get('/imagenes', function(req, res, next) {
  if (typeof req.user === "undefined"){
    return res.render('login');
  }
  res.render('imagenes', { title: 'Imágenes', active: "imagenes", user: req.user  });
});

/* GET home page. */
router.get('/reportes', function(req, res, next) {
  if (typeof req.user === "undefined"){
    return res.render('login');
  }
  res.render('reportes', { title: 'Reportes', active: "reportes", user: req.user  });
});


/**
 * Endpoint:  /login
 * Method:    GET
 * Description: Render the login view if the user is not logged in. Otherwise
 * redirect to home page.
 */
router.get('/login', function(req, res, next){
  if (req.query.success){
    res.render('login', { user: req.user, active: "login", message: "Username or password are incorrect. Please, try again." });
  } else {
    if (typeof req.user === "undefined"){
      res.render('login', {user: req.user, active: "login",});
    } else {
      res.redirect('/reportes');
    }
  }
});

/**
 * Endpoint:  /login
 * Method:    POST
 * Description: Authenticate user with passport. If failure, reload. If success,
 * redirect to home page.
 */
router.post('/login', passport.authenticate(
	'local', {
    successRedirect: '/',
    failureRedirect: '/login?success=0'
  })
);

/**
 * Endpoint:  /logout
 * Method:    GET
 * Description: Logout user. Redirect to home page.
 */
router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/login');
});


router.post('/download', async function(req, res, next){
  const fileName = `report_${Math.random().toString(36).substring(7)}.xlsx`;
  const { byDayData, byHourData } = JSON.parse(req.body.data);
  const byDayDataLength = (byDayData.data ? byDayData.data.length : 0)
  const byHourDataLength = (byHourData.data ? byHourData.data.length : 0)

  let dataSheet1 = []
  dataSheet1.push(["Dia", "Visitas"])
  for (var i = 0; i < byDayDataLength; i++){
    dataSheet1.push([byDayData.labels[i], byDayData.data[i]]);
  }
  let dataSheet2 = []
  dataSheet2.push(["Hora", "Dia", "Visitas"])
  for (var j = 0; j < byHourDataLength; j++){
    let label = byHourData.labels[j].split("|")
    dataSheet2.push([label[0], label[1], byHourData.data[j]]);
  }

  let wb = new ExcelJS.Workbook();
  const ws1 = wb.addWorksheet('Visitas por Dia');
  const ws2 = wb.addWorksheet('Visitas por Hora');
  ws1.addRows(dataSheet1);
  ws2.addRows(dataSheet2);
  var savedFilePath = path.join(TARGET_PATH, fileName);
  await wb.xlsx.writeFile(savedFilePath);

  return res.status(200).json({
    msg: "ok",
    fileName
  })
});

router.post('/download/special', async function(req, res, next){
  const fileName = `report_${Math.random().toString(36).substring(7)}.xlsx`;
  let reportBuilder = [];
  let boldRows = [];
  let { 
    byAgencyData,
    byTypeData,
    bySubtypeData 
  } = JSON.parse(req.body.data);
  if (!byAgencyData || !byTypeData || !bySubtypeData){
    return res.status(500).json({
      msg: "no data"
    })
  }

  // TABLA DE AGENCIAS
  let agencyTable = []; // Array of Arrays
  let listaDeAgencias = [];
  let listaDeDias = Object.keys(byAgencyData);
  let mapeoDeDias = {};
  let cantidadDeDias = listaDeDias.length;
  Object.keys(byAgencyData).map((fecha, dayIndex) => {
    const data = byAgencyData[fecha];
    if (data){
      Object.keys(data).map((agencia) => {
        let visitas = data[agencia];
        if (!listaDeAgencias.includes(agencia)){
          listaDeAgencias.push(agencia);
          let fila = Array(cantidadDeDias).fill(0);
          fila.unshift(agencia);
          fila.unshift('');
          agencyTable.push(fila);
        }
        let agencyIndex = listaDeAgencias.indexOf(agencia);
        agencyTable[agencyIndex][dayIndex + 2] += visitas; // Se suma dos por que al inicio va un espacio, y la agencia
        if (!(fecha in mapeoDeDias)){
          mapeoDeDias[fecha] = 0;
        }
        mapeoDeDias[fecha] += visitas;
      })
    }
  });
  reportBuilder.push(['']); // First empty row
  reportBuilder.push(['', 'AGENCIA'].concat(listaDeDias.map((d) => moment(d, 'YYYY-MM-DD').locale('es').format('DD-MMM'))));
  boldRows.push(reportBuilder.length);
  agencyTable.map((row) => {
    reportBuilder.push(row);
  });
  let lastRow = ['', 'TOTAL']
  listaDeDias.map((dia) => {
    lastRow.push(mapeoDeDias[dia])
  });
  reportBuilder.push(lastRow);
  boldRows.push(reportBuilder.length);

  reportBuilder.push([]);
  reportBuilder.push([]);

  // TABLA DE TIPO
  let typeTable = []; // Array of Arrays
  let listaDeTipos = [];
  listaDeDias = Object.keys(byTypeData);
  mapeoDeDias = {};
  cantidadDeDias = listaDeDias.length;
  Object.keys(byTypeData).map((fecha, dayIndex) => {
    const data = byTypeData[fecha];
    if (data){
      Object.keys(data).map((tipo) => {
        let visitas = data[tipo];
        if (!listaDeTipos.includes(tipo)){
          listaDeTipos.push(tipo);
          let fila = Array(cantidadDeDias).fill(0);
          fila.unshift(tipo);
          fila.unshift('');
          typeTable.push(fila);
        }
        let typeIndex = listaDeTipos.indexOf(tipo);
        typeTable[typeIndex][dayIndex + 2] += visitas; // Se suma dos por que al inicio va un espacio, y la agencia
        if (!(fecha in mapeoDeDias)){
          mapeoDeDias[fecha] = 0;
        }
        mapeoDeDias[fecha] += visitas;
      })
    }
  });
  reportBuilder.push(['']); // First empty row
  reportBuilder.push(['', 'TIPO DE VISITA'].concat(listaDeDias.map((d) => moment(d, 'YYYY-MM-DD').locale('es').format('DD-MMM'))));
  boldRows.push(reportBuilder.length);
  typeTable.map((row) => {
    reportBuilder.push(row);
  });
  lastRow = ['', 'TOTAL']
  listaDeDias.map((dia) => {
    lastRow.push(mapeoDeDias[dia])
  });
  reportBuilder.push(lastRow);
  boldRows.push(reportBuilder.length);

  reportBuilder.push([]);
  reportBuilder.push([]);

  // TABLAS DE SUBTIPO
  Object.keys(bySubtypeData).map((subtipo) => {
    let subTypeData = bySubtypeData[subtipo];
    let subTypeTable = []; // Array of Arrays
    let listaDeSubtipos = [];
    listaDeDias = Object.keys(subTypeData);
    mapeoDeDias = {};
    cantidadDeDias = listaDeDias.length;
    Object.keys(subTypeData).map((fecha, dayIndex) => {
      const data = subTypeData[fecha];
      if (data){
        Object.keys(data).map((tipo) => {
          let visitas = data[tipo];
          if (!listaDeSubtipos.includes(tipo)){
            listaDeSubtipos.push(tipo);
            let fila = Array(cantidadDeDias).fill(0);
            fila.unshift(tipo);
            fila.unshift('');
            subTypeTable.push(fila);
          }
          let subTypeIndex = listaDeSubtipos.indexOf(tipo);
          subTypeTable[subTypeIndex][dayIndex + 2] += visitas; // Se suma dos por que al inicio va un espacio, y la agencia
          if (!(fecha in mapeoDeDias)){
            mapeoDeDias[fecha] = 0;
          }
          mapeoDeDias[fecha] += visitas;
        })
      }
    });
    reportBuilder.push(['']); // First empty row
    reportBuilder.push(['', subtipo.toUpperCase()].concat(listaDeDias.map((d) => moment(d, 'YYYY-MM-DD').locale('es').format('DD-MMM'))));
    boldRows.push(reportBuilder.length);
    subTypeTable.map((row) => {
      reportBuilder.push(row);
    });
    lastRow = ['', 'TOTAL'];
    listaDeDias.map((dia) => {
      lastRow.push(mapeoDeDias[dia]);
    });
    reportBuilder.push(lastRow);
    boldRows.push(reportBuilder.length);
  
    reportBuilder.push([]);
    reportBuilder.push([]);
  });
  let wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Reporte Especializado');
  const nameColumn = ws.getColumn(2);
  nameColumn.width = 40;
  ws.addRows(reportBuilder);

  // Iterate over all rows (including empty rows) in a worksheet
  ws.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    row.font = {
      name: 'Arial',
      family: 1,
      size: 12
    }
  });
  boldRows.map((r) => {
    ws.getRow(r).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      cell.font = {
        name: 'Arial',
        family: 1,
        size: 12,
        bold: true
      }
    });    
  })
  var savedFilePath = path.join(TARGET_PATH, fileName);
  await wb.xlsx.writeFile(savedFilePath);

  res.status(200).json({
    msg: "ok",
    fileName 
  })
});

router.get('/download', function(req, res, next){
  const fileName = req.query.filename;
  var savedFilePath = path.join(TARGET_PATH, fileName);
  res.download(savedFilePath);
})

router.get('/download/special', function(req, res, next){
  const fileName = req.query.filename;
  var savedFilePath = path.join(TARGET_PATH, fileName);
  res.download(savedFilePath);
})

module.exports = router;
