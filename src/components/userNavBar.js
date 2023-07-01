import '../style/userNavBar.css';
import SignUpForm from './/signUpForm.js'
import { useState, useEffect, useRef } from 'react';
import { onSnapshot, collection, getDocs, getDoc, setDoc, doc, exists } from 'firebase/firestore'
import { app, db, auth } from '../firebase/firebase-config'
import { Link, useParams } from 'react-router-dom'



function UserNavBar(props) {

  //hides the form when not in use
  const [toggleSignUp, setToggleSignUp] = useState(false)
  // hides the form elements used for sign up when the log in button is clicked 
  const [switchToSignIn, setSwitchToSignIn] = useState(false)
  // switched the elements for the userInfoBar depending on a user being signed in or not. 
  const [userLoggedInNavBar, setUserLoggInNavBar] = useState(false)
  const [currentUsersName, setCurrentUsersName] = useState('')
  const { user } = useParams()
  const { subMockit } = useParams()
  const [ logoSubText, setlogoSubText ] = useState('');
  const [currentLogo, setCurrentLogo] = useState('')
  

//checks the auth state 
  useEffect(() => {
    auth.onAuthStateChanged(currentuser => {
      if(currentuser){
        console.log(currentuser.email + ' has logged in')
        
        getDoc(doc(db, 'users', currentuser.uid)).then(docSnap => {
          if (docSnap.exists()) {
            setUserLoggInNavBar(true)
           setCurrentUsersName(docSnap.data().userName)
          } else {
            console.log("no user")
          }
        })
       
      }
      else{
        console.log('user has logged out')
        setUserLoggInNavBar(false)
        setCurrentUsersName('')
      }
    })


  },[])

  useEffect(() => {

    if(user){

      setlogoSubText('u/' + user)
    }

  },[user])

  useEffect(() => {

    if (subMockit){
      setlogoSubText(props.subText)
    }

  },[props.subText])

  // creating a ref for the sinUpForm
let signUpRef = useRef()

// creates a useEffect that checks to see if a click has occurred outside the form
useEffect(() => {

  let handler = (e) => {
    if(!signUpRef.current?.contains(e.target)){
      setToggleSignUp(false)
      const wholePage = document.getElementById('mainContent')
      wholePage.style.opacity = "1"
    }
  }

  document.addEventListener("mousedown", handler) 
  //Removing the eventlistner from the dom after the useeffect has run 
  return () => {
    document.removeEventListener("mousedown", handler)
  }

},[])


  const signUpHandler = (e) => {
    setSwitchToSignIn(true)
    setToggleSignUp(true)
    const wholePage = document.getElementById('mainContent');
    wholePage.style.opacity = ".2";
  }

  const closeSignUpForm = () => {
    setToggleSignUp(false)
    const wholePage = document.getElementById('mainContent')
    wholePage.style.opacity = "1"
    
    }

  const signInHandler = () => {
    setSwitchToSignIn(false)
    setToggleSignUp(true)
    const wholePage = document.getElementById('mainContent');
    wholePage.style.opacity = ".2";
  }


  const signOutHandler = () => {
    auth.signOut()
  }
  
  


    return (

      <div id="userNavBar" >
        <div id='addToBottomLeft'>
            <div id="logo"><Link to={"/"} className='logoText'>mockit</Link> <Link   to={"/m/" + subMockit } className='logoSubText'>{logoSubText}</Link></div>
            <ul id="sortMenu">
                <div className='sortChoiceSelected'>new</div>
                <div className='sortChoice'>best</div>
                <div className='sortChoice'>all</div>

            </ul>
        </div>
        <div id='addToBottomRight'>
          <div id='userInfoBar'>
            {/* userInfoBar for logged in user */}
          {userLoggedInNavBar ? <div id='userInfoBar'>
              {/* <div className='userBarText'>Want to join?</div> */}
              <Link className='userBarLink' to={"/u/" + currentUsersName}>{currentUsersName}</Link>
              {/* <div className='userBarText'> | messages | </div>
              <div className='userBarLink' >preferences</div> */}
              <div className='userBarText'> | </div>
              <div className='userBarLink' onClick={(e) => signOutHandler(e)}>Log Out</div>
              </div> 
              
              : null}
              {/* userInfoBar for no user logged in */}
              {!userLoggedInNavBar ? <div id='userInfoBar'>
                <div className='userBarText'>Want to join?</div>
                <div className='userBarLink' onClick={(e) => signInHandler(e)}>Log in</div>
                <div className='userBarText'>or</div>
                <div className='userBarLink' onClick={(e) => signUpHandler(e)}>sign up</div>
                <div className='userBarText'>in seconds</div></div>
                 : null}
            </div>
        </div>
        { toggleSignUp ? <div id="signUpContainer" ref={signUpRef}><SignUpForm closeSignUpForm={closeSignUpForm} switchToSignIn={switchToSignIn} /></div> :null}
      </div>
     

    );
  }
  
  export default UserNavBar;