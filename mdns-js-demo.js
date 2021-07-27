var mdns = require('mdns-js');
 
mdns.excludeInterface('0.0.0.0');
var browser = new mdns.createBrowser(mdns.tcp('ssh'));
 
browser.on('ready', function () {
    browser.discover(); 
});
 
browser.on('update', function (data) {
    console.log('data:', data);
});