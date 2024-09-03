import React, { useContext, useEffect } from 'react'
import './Login.css'
import LoginArt from "../../Assets/Login/chat.jpg"
import { auth, db, google_provider} from '../../firebase/firebase'
import { signInWithRedirect, getRedirectResult, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { ContextStore } from '../../context/store'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'


function Login() {

  const { user, setUser } = useContext(ContextStore);
  const navigate = useNavigate();
  async function checkDocumentNotExists(collectionName, documentId) {
    const docRef = doc(db, collectionName, documentId);
    const result = await getDoc(docRef).then(
      (res) => {
        if (res.exists()) {
          console.log('user exists')
          return false;
        } else {
          console.log('user not exists')
          return true;
        }
      }
    ).catch((err) => { console.log(err) })

    return result
  }

  async function addUser(user) {
    const addCollection = collection(db, 'Users')
    const myDocRef = doc(addCollection, user.uid);
    await setDoc(myDocRef, {
      email: user.email,
      name: user.displayName,
      pfp: user.photoURL,
      uid: user.uid
    });

  }

  function handleLogin() {
    signInWithPopup(auth, google_provider).then(
      async (res) => {
        setUser(res.user)
        const userNotExists = await checkDocumentNotExists("Users", res.user.uid)
        // console.log("condition" + " " + userNotExists)
        if (userNotExists) {
          await addUser(res.user)
          // console.log("created user")
        } else {
          // console.log("user not created")
        }
        navigate("/home")
      }
    ).catch((err) => {
      console.log(err);

    })
  }


  useEffect(() => {
    if (user) {
      localStorage.setItem("cur_user_id", user.uid)
    }

  }, [user])


  return (
    <div className='main-cont'>
      <img src={LoginArt} className='login-img' alt="" />
      <button type="button" className="google-sign-in-button" onClick={() => { handleLogin() }} >
        Sign in with Google
      </button>
    </div>
  )
}

export default Login