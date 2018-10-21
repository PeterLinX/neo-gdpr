// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyDba6jJoD_M6hEK9Td134hjg9EAmZkeR7c",
    authDomain: "neo-hackathon.firebaseapp.com",
    databaseURL: "https://neo-hackathon.firebaseio.com",
    projectId: "neo-hackathon",
    storageBucket: "neo-hackathon.appspot.com",
    messagingSenderId: "852089438833"
  }
};
