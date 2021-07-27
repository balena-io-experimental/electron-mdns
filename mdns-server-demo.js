function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const discover = async function(total, port)
{
  var mdns = require('mdns-server')({
    reuseAddr: true, // in case other mdns service is running
    loopback: true,  // receive our own mdns messages
    noInit: true,
    srcPort: port
  })

  // listen for response events from server
  mdns.on('response', function(response) {
    if (response.answers) {
      response.answers.forEach(element =>
          {
            if(element.type === 'PTR' && element.type !== '_resin-device._sub._ssh._tcp.local')
            {
              return;
            }

            if(element.type === 'A')
            {
              
              if(!total.has(element.data))
              {
                console.log(`${total.size}: ${element.data} at ${element.name}`);
                total.set(element.data, element);
              }
              else
              {
                console.log(`Already found ${element.data} at ${element.name}`)
              }
            }
        })
      }    
  })

  // listen for the server being destroyed
  mdns.on('destroyed', function () {
    console.log(`Done`);
  })

  // query for all services on networks
  mdns.on('ready', function () {
    console.log(`Finding balena devices using ${port === undefined ? 'unicast' : 'multicast'}`);
    mdns.query({
      questions:[{
        name: '_resin-device._sub._ssh._tcp.local',
        type: "PTR"
      }]
    })
  })

  mdns.on('error', function (error){
    console.log(`Error: ${error} `)
  })

  // initialize the server now that we are watching for events
  mdns.initServer()

  await timeout(5000)
  mdns.destroy()

  //return total;
}

const mOs = require('os');

let list = [];
let netifs = mOs.networkInterfaces();
for (let dev in netifs) {
    netifs[dev].forEach((info) => {
        if (info.family === 'IPv4' && info.internal === false) {
            let m = info.address.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
            if (m) {
                list.push(m[1]);
            }
        }
    });
}
console.log(list);

(async function () {
  var total = new Map();
  await discover(total, undefined);
  await discover(total, 5353);
  console.log(`Total balena devices found = ${total.size}`)
  process.exit(0);
})()