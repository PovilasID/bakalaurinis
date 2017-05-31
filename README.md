# Oro Puslas

  EN: A bachelor thesis projects that is a simple data colection system for asthma patients 
  LT: Bakalaurinio darbo implementacija, kuri padeda astmos pacientasms surinkti savo būklės duomenis
  
  Project allows to imput PEF and FEV1 parameters and if patient imputed their profile settings automatily calculates if their condition is getting worse or better also allows to chat with a doctor about a specific parameter

## Main libraries used
* [react](https://github.com/facebook/react)
* [redux](https://github.com/rackt/redux)
* [firebase](https://www.npmjs.com/package/firebase)
* [react-router](https://github.com/rackt/react-router)
* [redux-promise](https://github.com/acdlite/redux-promise)
* [webpack](https://github.com/webpack/webpack)
* [babel](https://github.com/babel/babel)

Quick Start
-----------

```shell
$ git clone https://github.com/povilasid/bakalaurinis.git
$ cd react-redux-firebase-boilerplate
$ npm install
$ npm run dev
```

Firebase settings
--------
First you need to create your firebase application to fetch settings for boilerplate. For more information how to add your web app check this [resource](https://firebase.google.com/docs/web/setup). After it copy your settings from firebase and fill config.js

```javascript
module.exports = {

    FIREBASE_CONFIG: {

      apiKey: "",
      authDomain: "",
      databaseURL: "",
      storageBucket: "",

    }
}
```

Commands
--------

|Script|Description|
|---|---|
|`npm run dev`| Run development server with webpack-dev-server @ `localhost:3000`|
|`npm run build`| Test, and build the application to `./dist`|
|`npm start`| Start production ready app with pm2 from `./dist` @ `localhost:8080`|
|`npm run lint`| Run ESLint on `./src`|


### DEMO 
[https://breathcount-app.firebaseapp.com/](https://breathcount-app.firebaseapp.com/)

