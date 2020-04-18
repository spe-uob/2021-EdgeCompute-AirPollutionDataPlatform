# Website 

## Install Web Packages

```
 apt-get install nodejs nodejs-doc npm
```

Or 

Install from [NodeSource](https://github.com/nodesource/distributions/blob/master/README.md)

## Install npm Packages

```
npm install express xss nodemailer ckan point-in-polygon easy-autocomplete jscoord @turf/turf @turf/hex-grid @turf/square-grid @awaitjs/express mustache-express
```

## Change Configuration Files

Modify the CKAN Hostname in `dataset-dao.js` and  `group-dao.js`

```
var CKAN = require('ckan')
const client = new CKAN.Client('http://ckan.bitvijays.local');
```
