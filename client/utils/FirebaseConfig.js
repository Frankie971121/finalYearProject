import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCCP4M_mXMYW-EPg5iKrKbQvRxgJR2M1h0",
    authDomain: "testing1-c855a.firebaseapp.com",
    databaseURL: "https://testing1-c855a-default-rtdb.firebaseio.com",
    projectId: "testing1-c855a",
    storageBucket: "testing1-c855a.appspot.com",
    messagingSenderId: "163013434819",
    appId: "1:163013434819:web:8076fe50e10a896e4b3176",
    measurementId: "G-85N08RNFQ1"
};

let app;

if(firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
}
else {
    app = firebase.app();
}

const db = app.firestore();
const auth = app.auth();
const storage = app.storage();

export { db, auth, storage };