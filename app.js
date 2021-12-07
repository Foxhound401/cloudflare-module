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
// app.use(express.static(path.join(__dirname, "public"), { 
//   extensions : ['html']
// }));
// app.set('view engine', 'jade');

// var cf = require('cloudflare')({
//   email: process.env.CLOUDFLARE_EMAIL,
//   key: process.env.CLOUDFLARE_KEY
// });


var cf = require('cloudflare')({
  token: process.env.CLOUDFLARE_TOKEN
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


const createDomains = [
  "sso-danang",
  "feedback-danang",
  "blog-danang",
  "location-danang",
  "social-network-danang"
];

const eastplayers = "f8d0feb716e94c34ad5d016a57255ff3"
const ip = "139.59.217.126";

const createDnsRecord = async (zone_id, record) => {

  const resp = [];
  await createDomains.forEach(async dm => {
    try {
      const record = {
        type: "A",
        name: `${dm}`,
        content: `${ip}`,
        ttl: 1,
        proxied: true
      }
      console.log(record)
      const create = await cf.dnsRecords.add(eastplayers, record);
      resp.push(create);
    } catch (error) {
      console.log(error)
      return error
    }
  });

  return resp;
}

app.post('/dns-records', async (req, res) => {
  const zone_id = req.query.zone_id;
  const records = await createDnsRecord();
  res.send(records)
});

app.get('/dns-records', async (req, res) => {
  const zone_id = req.query.zone_id;
  const resp = await cf.dnsRecords.browse(zone_id)
  res.send(resp)
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
// app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  res.send(err);
});


module.exports = app;
