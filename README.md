### Install

Backend:

- [node.js](https://nodejs.org/) (web server)
```shell
npm install
bower install
```


Phonegap:

```shell
npm install -g bower yo gulp generator-mobileangularui
sudo npm install -g phonegap
npm install
bower install
gulp build
phonegap run ios # or android, or whatever is your target
```


Cordova:

```shell
sudo npm install -g cordova
cordova plugin add https://github.com/cordova-sms/cordova-sms-plugin.git
cordova platform remove ios
cordova platform add ios
cordova platform remove android
cordova platform add android
cordova build ios
cordova run ios --device
```


Xcode:
make sure that sms.m is in Compile sources
make sure that MessageUi.framework is in Link binary with libraries
