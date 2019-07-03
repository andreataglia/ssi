var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const ngrok = require('ngrok')
const bodyParser = require('body-parser')
const Pistis = require('../../pistis/pistis.js')
const VerifiableCredential = require('../../pistis/verifiableCredential.js')

var open = require('open');

app.use(express.static(__dirname + 'views'));

console.log('loading server...')

const Time30Days = () => Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60
let endpoint = ''

const messageLogger = (message, title) => {
  const wrapTitle = title ? ` \n ${title} \n ${'-'.repeat(60)}` : ''
  const wrapMessage = `\n ${'-'.repeat(60)} ${wrapTitle} \n`
  console.log(wrapMessage)
  console.log(message)
}

app.use(bodyParser.json({
  type: '*/*'
}))


let pistis = new Pistis('0xbc3ae59bc76f894822622cdef7a2018dbe353840', '74894f8853f90e6e3d6dfdd343eb0eb70cca06e552ed8af80adadcc573b35da3');

var currentConnections = {};

app.get('/', (req, res) => {
  res.send('The backend is only useful for socket.io')
})
app.post('/vp', (req, res) => {
  const jwt = req.body.access_token
  const socketid = req.query['socketid']
  console.log('someone sent a vc')
  // if (jwt != null) {
  //   credentials.authenticateDisclosureResponse(jwt).then(creds => {
  //     let objectToSend = {
  //       sender: creds.did,
  //       vcs: []
  //     }
  //     creds = creds.verified
  //     for (var i = 0; i < creds.length; i++) {
  //       let ent = tcm.searchEntity(creds[i].iss)
  //       let selfStated = (ent != null ? false : true)
  //       if (selfStated) {
  //         ent = creds[i].ent
  //       }
  //       objectToSend.vcs.push({
  //         iat: creds[i].iat,
  //         sub: creds[i].sub,
  //         credentialSubject: creds[i].claim,
  //         exp: creds[i].exp,
  //         iss: creds[i].iss,
  //         ent: {
  //           ent: ent,
  //           selfStated: selfStated
  //         }
  //       })
  //     }
  //
  //     console.log(objectToSend)
  //
  //   })
  // }
  currentConnections[socketid].socket.emit('emitVC', objectToSend)
});

//Socket Events
io.on('connection', function(socket) {
  console.log('a user connected: ' + socket.id);
  currentConnections[socket.id] = {
    socket: socket
  };

  pistis.createDisclosureRequest({
    requested: ["*"],
    callbackUrl: endpoint + '/vp?socketid=' + socket.id
  }).then(token => {
    socket.emit('shareQr', {
      uri: Pistis.tokenToUri(token, false),
      qr: Pistis.tokenToQr(token, false)
    })
  })


  let vc0 = new VerifiableCredential({
    subjectDID: 'did:ethr:0xa0edad57408c00702a3f20476f687f3bf8b61ccf',
    expiry: 0,
    credentialSubject: {
      "@context": "https://schema.org",
      "@type": "DiagnosticProcedure",
      "name": "Mbareeeeeee",
      "bodyLocation": "<?f0?>",
      "outcome": {
        "@type": "MedicalEntity",
        "code": {
          "@type": "MedicalCode",
          "codeValue": "0123",
          "codingSystem": "ICD-10"
        },
        "legalStatus": {
          "@type": "MedicalImagingTechnique",
          "image": "..."
        }
      }
    }
  })
  vc0.addLargeFile({
    location: 'remote',
    content: 'https://www.qldxray.com.au/wp-content/uploads/2018/03/imaging-provider-mobile.jpg'
  }).then(() => {
    pistis.createAttestationVP([vc0]).then(vp => {
      // socket.emit('vcQr', {
      //   uri: Pistis.tokenToUri(vp, false),
      //   qr: Pistis.tokenToQr(vp, false)
      // })
    })
  })

  socket.on('vcbuilder_genQr', function(credential){
    let vc = new VerifiableCredential({
      subjectDID: credential.sub,
      expiry: credential.exp,
      credentialSubject: credential.csu,
    })
    pistis.createAttestationVP([vc]).then(vp => {
      socket.emit('vcbuilder_vcQr', {
        uri: Pistis.tokenToUri(vp, false),
        qr: Pistis.tokenToQr(vp, false)
      })
    })
  })

  socket.on('disconnect', function() {
    console.log(socket.id + ' disconnected...')
    delete currentConnections[socket.id];
  })

});


http.listen(8089, () => {
  console.log('ready!!!')
  ngrok.connect(8089).then(ngrokUrl => {
    endpoint = ngrokUrl
    console.log(`Polimi Service running, open at ${endpoint}`)
    open(endpoint, {
      app: 'chrome'
    })
  });
})
