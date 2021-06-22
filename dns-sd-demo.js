const mDnsSd = require('node-dns-sd');

mDnsSd.discover({
    name: '_resin-device._sub._ssh._tcp.local'
}).then((device_list) => {
    console.log(JSON.stringify(device_list, null, '  '));
}).catch((error) => {
    console.error(error);
});