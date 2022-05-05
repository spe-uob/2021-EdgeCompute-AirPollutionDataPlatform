# Setup Website

## Install Web Packages

```shell
 apt-get install nodejs nodejs-doc npm
```

Or

Install from [NodeSource](https://github.com/nodesource/distributions/blob/master/README.md)

## Install npm Packages

```shell
npm install
```

## Change Configuration Files

Modify the CKAN Hostname in `dataset-dao.js` and  `group-dao.js`

```js
var CKAN = require('ckan')
const client = new CKAN.Client('http://ckan.bitvijays.local');
```

## Set the Resource ID in `website/service/airdata-service.js`

```js
const unitsID = "10df8c8d-f681-4325-bf75-21064ba81a2f"
const areas = [{
    area: "Bristol",
    center: [-2.6, 51.47],
    groupID: "8e049fd6-4407-4d7f-ad32-16a5d405790a",
    lastData: {
        necessaryFields: "6a0c2e53-f6a8-4198-bd52-c9655890e381",
        pointIDS: {
            Yearly: "0e6c4aaa-eef3-41a1-b70c-fb3a826a27be",
            Daily: "7e96b4d8-854c-489a-94aa-1f9c19bedd07",
            Hourly: "665b5270-9867-4ba6-889d-c9d5c46e310f"

        },
        polygonIDS: {
            Yearly: "eb10e278-9766-4f12-9f1d-cf9dbce8bec4"
        }
    },
```

## Set the MapBox Access Token in `website/public/js/map.js`

Search for `mapbox_public_key` in /public/js/map.js, which is the second line

## Setup the webserver as a service

```shell
vi /etc/systemd/system/airqualityplatform.service
```

```bash
[Unit]
Description=Nodejs app for the air quality platform

[Service]
ExecStart=/usr/bin/node /home/ubuntu/AirPollutionDataPlatform/website/server.js
Restart=always
User=nobody
Group=nogroup
Environment=PATH=/usr/bin:/usr/local/bin:/usr/local/lib/node/nodejs/bin
Environment=NODE_ENV=production
WorkingDirectory=/home/ubuntu/AirPollutionDataPlatform/website

[Install]
WantedBy=multi-user.target
```
