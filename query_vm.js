const request = require('request');

const server = '172.20.12.113:8080'

function polling (location, cb) {
  location = location.replace(/[0-9]+(?:\.[0-9]+){3}:[0-9]+/, server)
  const interval = setInterval(function () {
    request(location, function(err, res, body) {
      if (body) {
        console.log(body)
        clearInterval(interval)
      }
    })
  }, 1000)
}


function login (cb) {
  const options = {  
    url: `http://${server}/zstack/v1/accounts/login`,
    method: 'PUT',
    json: {
      "logInByAccount": {
        "password": "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86",
        "accountName": "admin"
      }
    }
  }

  request(options, function(err, res, body) {  
    if (cb) cb(body.inventory.uuid)
  })
}

function createVm (sessionUuid, cb) {
  const options = {  
    url: `http://${server}/zstack/v1/vm-instances`,
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'User-Agent': 'zstack-example-client',
        "Authorization": `OAuth ${sessionUuid}`,
    },
    json: {
      "params": {
        name: 'test',
        instanceOfferingUuid: 'bba4b231c21e468291752183bf119504',
        imageUuid: 'b7cb20cff28e497db074332da6a2fc5c',
        l3NetworkUuids: ['4ae778505f004190bc12f617000e2543'],
        defaultL3NetworkUuid: '4ae778505f004190bc12f617000e2543'
      }
    }
  }

  request(options, function(err, res, body) {
    polling(body.location)
  })
}

login(createVm)