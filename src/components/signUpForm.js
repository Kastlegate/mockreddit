import { useState } from 'react';
import '../style/signUpForm.css';
import { onSnapshot, collection, getDocs, getDoc, setDoc, doc, exists } from 'firebase/firestore'
import { useEffect, useRef } from 'react'
import { app,
    db,
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
 } from '../firebase/firebase-config'




function SignUpForm(props) {

    //creating states for the inputs
    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [passwordMatch, setPasswordMatch] = useState('')
    const [switchToSignIn, setSwitchToSignIn] = useState(props.switchToSignIn)

    //resets the red border off of the nonmatching password inputs
    const changePasswordBorder = () => {
        if (switchToSignIn === true) {
            let passwordErrorBox = document.getElementById("password")
            let passwordMatchErrorBox = document.getElementById("passwordMatch")
            passwordErrorBox.style.borderColor = ""
            passwordMatchErrorBox.style.borderColor = ""
        }
    }

    const sendNewUserToFirestore = (id, ) => {
        //stores the username in a list for all user names, that can referenced to prevent duplicate user names
        setDoc(doc(db, 'listOfUserNames', userName), {
            uid: id
          })
        //   creates the new user, with the auth uid, and gives the firestore document field for username
          setDoc(doc(db, 'users', id), {
            userName: userName,
            subcribedSubMockits: [],
          })
        
    }
   


    //handler for when the user hits the submit button
    const handleSubmit = (e) => {
        e.preventDefault()

        if (switchToSignIn === true) {

            const collectionRef = collection(db, 'listOfUserNames');
            getDocs(collectionRef)
            .then((snapshot) => {
                console.log(snapshot.docs)
            })

            //simple validation check for new password
            if (password !== passwordMatch) {
                alert("passwords do not match")
                let passwordErrorBox = document.getElementById("password")
                let passwordMatchErrorBox = document.getElementById("passwordMatch")
                passwordErrorBox.style.borderColor = "red"
                passwordMatchErrorBox.style.borderColor = "red"
            }
            else if (password === passwordMatch) {
                //checks to see if the new user name already exists, and if so, do not sign up the user
                getDoc(doc(db, 'listOfUserNames', userName)).then(docSnap => {
                    if (docSnap.exists()) {
                      console.log("User Name already exists");
                    } else {
                        //if the user name does not exist, and the passwords match, signs up the new user
                        createUserWithEmailAndPassword(auth, email, password).then(cred => {
                            return sendNewUserToFirestore(cred.user.uid)
                            })
                    }
                  })

            }

        }
        else if (switchToSignIn === false) {
            signInWithEmailAndPassword(auth, email, password)
        }

        // resetting the form by putting blank strings into the form state
        setEmail('')
        setUserName('')
        setPassword('')
        setPasswordMatch('')
        props.closeSignUpForm()

    }


    // useEffect(() => {

    //     const collectionRef = collection(db, 'users');
    //     getDocs(collectionRef)
    //     .then((snapshot) => {
    //         console.log(snapshot.docs)
    //     })


    //     onSnapshot(collection(db, "users"), (snapShot) => {
    //         console.log(snapShot.docs)
    //         console.log(auth.currentUser.displayName)
    //     })

    // },[])


    return (

        <form id="signUpForm" onSubmit={(e) => handleSubmit(e)}>
            <div id='signUpIntroText'>Sign up to get your own personalized Mockit experience!</div>
            <div id='signUpSubText'>By having a Mockit account, you can join, vote, and comment on all your favorite Mockit content. Sign up in just seconds.</div>
            {/* Login text will only appear if the log in button is pushed, and the other elements for the sign up function will be hidden */}
            {!switchToSignIn ? <label className='formText'> <div>LOG IN</div> </label> : null}
            <label className='formText'>
                <div>ENTER EMAIL</div>
                <input type="email" required placeholder='email address' value={email} onChange={(e) => setEmail(e.target.value)} className='signUpFormInput'></input>
            </label>

            {switchToSignIn ? <label className='formText'>
                <div>ENTER USERNAME</div>
                <input type="text" required placeholder='enter a username' value={userName} onChange={(e) => setUserName(e.target.value)} className='signUpFormInput'></input>
            </label> : null}

            <label className='formText'>
                <div>ENTER PASSWORD</div>
                <input type="password" required placeholder='enter a password' value={password} onChange={(e) => { setPassword(e.target.value); changePasswordBorder() }} className='signUpFormInput' id='password'></input>
            </label>
            
            {switchToSignIn ?
                <label className='formText'>
                    <div>RE-ENTER PASSWORD</div>
                    <input type="password" required placeholder='re-enter password' value={passwordMatch} onChange={(e) => { setPasswordMatch(e.target.value); changePasswordBorder() }} className='signUpFormInput' id='passwordMatch'></input>
                </label>
                : null}

            {switchToSignIn ? <input className='submitButton' type="submit" value="Sign Up!" ></input> : null}{!switchToSignIn ? <input className='submitButton' type="submit" value="Log In!" ></input> : null}
        </form>

    );
}

export default SignUpForm;