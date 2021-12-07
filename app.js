var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var dotenv = require('dotenv');

// var indexRouter = require('./routes/index');

dotenv.config()
var app = express();

var cf = require('cloudflare')({
  email: process.env.CLOUDFLARE_EMAIL,
  key: process.env.CLOUDFLARE_KEY
});

const getZoneByName = async (zoneName) => {
  const resp = await cf.zones.browse()
  // console.log(resp.result);
  const result = resp.result.filter(zone => zone.name === zoneName)
  // return resp.result;
  return result
}

const getAllZones = async () => {
  const resp = await cf.zones.browse()
  const result = resp.result.map((zone) => ({ id: zone.id, name: zone.name }))
  return result
}

const getAllDnsRecord = async (zone_id) => {
  const resp = await cf.dnsRecords.browse(zone_id);
  return resp;
}

const createDnsRecord = async (zone_id, record) => {
  const resp = await cf.dnsRecords.add(zone_id, record);
  return resp;
}

app.get('/dns-records', (req, res) => {
  const zone_id = req.query.zone_id;
  const records = getAllDnsRecord(zone_id);
  res.send(records)
})

app.get('/', (req, res) => {
  res.send("wrong place")
});

app.get('/domains', async (req, res) => {
  const domains = await getAllZones()
  res.send(domains)
});

app.get('/domains/:id', async (req, res) => {
  const domain = req.query.domain;
  const result = await getZoneByName(domain)
  res.send(result)
});

app.post('/domains', async (req, res) => {
  const domain = req.query.domain;

  res.send(result)
});

// Create records
app.post('/domains', async (req, res) => {
  const domain = req.query.domain;

  res.send(result)
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
