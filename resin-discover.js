rds = require('resin-discoverable-services')

rds.enumerateServices()
    .then(availableServices => {
        console.log(availableServices)
    })


rds.findServices(['_resin-device._sub._ssh._tcp'])
    .then(service => console.log(service))