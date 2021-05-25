import React, {useRef, useState,} from 'react'
import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/auth'

import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'


firebase.initializeApp({
  apiKey: "AIzaSyAglej5ssYduVVzB9FLGaeL9V0qQMh9CNU",
  authDomain: "chat-app-2bf35.firebaseapp.com",
  projectId: "chat-app-2bf35",
  storageBucket: "chat-app-2bf35.appspot.com",
  messagingSenderId: "452808160231",
  appId: "1:452808160231:web:4ea54c2dccdc2168308342"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
      <h1>Firebase Chat App 🔥</h1>
      <SignOut />
      </header>

      <section className="App-main">
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign In With Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef()
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
    <main>
    {messages && messages.map(msg =><ChatMessage key={msg.id} message={msg} />)}
    <div ref={dummy}></div>
    </main>
  <form onSubmit={sendMessage}>
    <input placeholder="Say something nice"value={formValue} onChange={(e) => setFormValue(e.target.value)} />

    <button type="submit">🕊️</button>
    </form>

    </>
  )
}

function ChatMessage(props) {
const {text,uid, photoURL} = props.message;
const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
