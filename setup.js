const fs = require('fs');
const cheerio = require('cheerio');
const $ = indexHtml();

const [, , name, title] = process.argv;

// SECTION: Setup Index.html
$('title').text(title);
$('meta[name="application-name"]').attr('content', title);
$('meta[name="apple-mobile-web-app-title"]').attr('content', title);

fs.writeFileSync('./src/index.html', $.html());

// SECTION: Setup Angular json
let angularJsonContent = fs.readFileSync('angular.json', { encoding: 'utf8' });
let packageJsonContent = fs.readFileSync('package.json', { encoding: 'utf8' });
angularJsonContent = angularJsonContent.replace(/buildozer/ig, name);
packageJsonContent = packageJsonContent.replace(/angular-buildozer/ig, name);
packageJsonContent = packageJsonContent.replace(/buildozer/ig, name);
fs.writeFileSync('./angular.json', angularJsonContent);
fs.writeFileSync('./package.json', packageJsonContent);

// SECTION: Setup Package json
const packageJson = require('./package.json');
packageJson.name = name;
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 4));

// SECTION: Setup Manifest
const webmanifest = require('./src/manifest.json');
webmanifest.name = title || name;
webmanifest.short_name = title || name;
fs.writeFileSync('./src/manifest.json', JSON.stringify(webmanifest, null, 4));

// SECTION: Clean up environments
let environment = fs.readFileSync('src/environments/environment.ts', { encoding: 'utf8' })
let environmentProd = fs.readFileSync('src/environments/environment.prod.ts', { encoding: 'utf8' })
environment = environment.replace("serverOrigin: 'http://localhost:8080/'", "serverOrigin: ''");
environment = environment.replace("endpointUrl: 'http://localhost:8080/api/'", "endpointUrl: ''");
environmentProd = environmentProd.replace("serverOrigin: 'https://node-buildozer.herokuapp.com/'", "serverOrigin: ''");
environmentProd = environmentProd.replace("endpointUrl: 'https://node-buildozer.herokuapp.com/api/'", "endpointUrl: ''");
fs.writeFileSync('src/environments/environment.ts', environment);
fs.writeFileSync('src/environments/environment.prod.ts', environmentProd);

// SECTION: Clean up translation
let enI18n = fs.readFileSync('src/assets/i18n/en.json', { encoding: 'utf8' });
enI18n = `{"application_name":"${title || name}"}`
fs.writeFileSync('src/assets/i18n/en.json', enI18n);
let arI18n = fs.readFileSync('src/assets/i18n/ar.json', { encoding: 'utf8' });
arI18n = `{"application_name":"${title || name}"}`
fs.writeFileSync('src/assets/i18n/ar.json', arI18n);



function indexHtml() {
    const data = fs.readFileSync('./src/index.html', 'utf8');
    return cheerio.load(data);
}
