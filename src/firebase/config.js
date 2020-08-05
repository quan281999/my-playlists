import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';

var firebaseConfig = {
    apiKey: "AIzaSyANO5kG35OJ5mCzp8txBgFQ_RCRwuf2kYE",
    authDomain: "my-playlists-quan-nguyen.firebaseapp.com",
    databaseURL: "https://my-playlists-quan-nguyen.firebaseio.com",
    projectId: "my-playlists-quan-nguyen",
    storageBucket: "my-playlists-quan-nguyen.appspot.com",
    messagingSenderId: "1066563222740",
    appId: "1:1066563222740:web:431a59f126b3c9e0cd0f41"
};

firebase.initializeApp(firebaseConfig);

const projectStorage = firebase.storage();
const projectDatabase = firebase.database();

export {projectStorage, projectDatabase};