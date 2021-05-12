import firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCFoTW4MFoxN6FhSLkRS4y6sVQV5ZGfI4k',
  authDomain: 'nhatro-f305f.firebaseapp.com',
  projectId: 'nhatro-f305f',
  storageBucket: 'nhatro-f305f.appspot.com',
  messagingSenderId: '909881900635',
  appId: '1:909881900635:web:951b273b8bda6eee54897e'
}
const fire = firebase.initializeApp(firebaseConfig)
export default fire
