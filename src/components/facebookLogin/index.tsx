import React, { useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { useAppState } from "../../state";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
};

function FacebookLogin() {
  const { state, setState } = useAppState();


  const updateUser = async (displayName: string, uid: string, photoURL: string, provider: string, email: string) => { 
    try {   
    const params = new window.URLSearchParams({ displayName, uid, photoURL, provider, email });
    const url = `${process.env.REACT_APP_API_BASE_URL}/updateUser?${params}`;
    const response = await fetch(url, {method: 'POST'});
    const data = await response.json();
    setState({ displayName, uid, photoURL, authState: true, id: data.id });
    } catch (err) {
      signOut();
    }
  };

  useEffect(() => {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  }, []);

  const join = () => {
    const provider = new firebase.auth.FacebookAuthProvider().addScope("email");
    firebase.auth().signInWithPopup(provider).then(data => {
      if (data.user && data.user.uid && data.user.displayName && data.user.photoURL && data.user.email) {
        const { displayName, uid, photoURL, email } = data.user;
        const provider = 'facebook'
        updateUser(displayName, uid, photoURL, provider, email);
      } else {
        signOut();
      }
    });
  };

  const signOut = () => {
    firebase.auth().signOut();
    setState({
      displayName: null,
      uid: null,
      photoURL: null,
      authState: false
    });
  };
  

  return (
    <div className="FacebookLogin">
      {state.authState && state.displayName ? (
        <button onClick={signOut}>Logout</button>
      ) : (
        <button onClick={join}>Join with Facebook</button>
      )}
    </div>
  );
}

export { FacebookLogin };
