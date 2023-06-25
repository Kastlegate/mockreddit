import CreateSubMockitMenu from './/CreateSubMockitMenu.js'
import CreateNewLinkMenu from './/CreateNewLinkMenu.js'
import '../style/mockItMenu.css';
import { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase/firebase-config.js';
import { useParams } from 'react-router-dom';
import {  updateDoc, arrayUnion, getDoc, doc, exists } from 'firebase/firestore'

function MockItMenu(props) {

  const [showCreateNewSubMockitMenu, setShowCreateNewSubMockitMenu] = useState(false);
  const [showCreateNewLinkMenu, setShowCreateNewLinkMenu] = useState(false);
  const [showSubscribeButton, setShowSubscribeButton] = useState(false)
  const [sideBar, setSideBar] = useState(props.sideBar)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { subMockit } = useParams()
  const { user } = useParams()
  const [subscribers, setsubScribers] = useState()
  const [switchSubscribeButton, setSwitchSubscribeButton] = useState()


  const createSubMockitHandler = () => {
    let mainContent = document.querySelector('.SubMockitThread')
    mainContent.hidden = true;
    let mockItSideMenu = document.getElementById('mockItMenuContainer')
    mockItSideMenu.style.display = 'none';
    setShowCreateNewSubMockitMenu(true)
  } 

  const createNewLinkHandler = () => {
    let mainContent = document.querySelector('.SubMockitThread')
    mainContent.hidden = true;
    let mockItSideMenu = document.getElementById('mockItMenuContainer')
    mockItSideMenu.style.display = 'none';
    setShowCreateNewLinkMenu(true)
  }

  //handles the subscribe/unsubscribe buttons being pushed
  const subscribeHandler = () =>{
    console.log('subscribe clicked')

    const user = auth.currentUser;
    
    if(user){

      getDoc(doc(db, 'subMockIts', subMockit)).then(docSnap => {
        if (docSnap.exists())  {
          
          if(!docSnap.data().subscribers.indexOf(user.uid) > -1){
            updateDoc(doc(db, 'subMockIts', subMockit), {
              subscribers: arrayUnion(user.uid)
              })
              let newSubsriberCount = docSnap.data().subscribers.length + 1
              setsubScribers(newSubsriberCount)
              setSwitchSubscribeButton(false)  

            updateDoc(doc(db, 'users', user.uid), {
              subcribedSubMockits: arrayUnion(subMockit)
              })
          
          }  
        }       
      })
    }
  }

  //handles the subscribe/unsubscribe buttons being pushed
  const unSubscribeHandler = () =>{
    console.log('unsubscribe clicked')

    const user = auth.currentUser;
    
    if(user){

      getDoc(doc(db, 'subMockIts', subMockit)).then(docSnap => {
        if (docSnap.exists())  {
         
          if(docSnap.data().subscribers.indexOf(user.uid) > -1){
            const index = docSnap.data().subscribers.indexOf(user.uid)
            let removeFromSubscribersArray = [...docSnap.data().subscribers]
            removeFromSubscribersArray.splice(index, 1)

            updateDoc(doc(db, 'subMockIts', subMockit), {
              subscribers: removeFromSubscribersArray
              })

              let newSubsriberCount = docSnap.data().subscribers.length - 1
              setsubScribers(newSubsriberCount)
              setSwitchSubscribeButton(true)

            getDoc(doc(db, 'users', user.uid)).then(userdocSnap => { 

              const indexTwo = userdocSnap.data().subcribedSubMockits.indexOf(subMockit)
              let removeFromSubscriptionsArray = [...userdocSnap.data().subcribedSubMockits]
              removeFromSubscriptionsArray.splice(indexTwo, 1)

              updateDoc(doc(db, 'users', user.uid), {
                subcribedSubMockits: removeFromSubscriptionsArray
                }) 
              })
            }    
        }       
     })
    }
  }
  
  // checks if the params has a user and removes the subscribe/join button
  useEffect (() => {
  
    if (user){
      const currentuser = auth.currentUser;
      if(currentuser){
        setShowSubscribeButton(false)
      } 
      
    }
  }, [user]);

// shows the subscribe and leave buttons if inside a submockit
useEffect (() => {
  
  if (subMockit){
    getDoc(doc(db, 'subMockIts', subMockit)).then(docSnap => {
      if (docSnap.exists())  {
        const currentuser = auth.currentUser;
        if(currentuser){
          if(docSnap.data().subscribers.includes(currentuser.uid)){
            setSwitchSubscribeButton(false)
            console.log("true")
          }
          else{
            setSwitchSubscribeButton(true)
          }
          setShowSubscribeButton(true)
        }
        
       
        if(docSnap.data().subscribers){
          setsubScribers(docSnap.data().subscribers.length)
        }
      } 
            
   })    
  }
}, [subMockit]);


    return (

      <div id="mockItMenu" >
        <div id='mockItMenuContainer'>
          <input type="text" id="mockItSearch" placeholder="search" ></input>
          <button className='mockItButton' onClick={(e) => createNewLinkHandler(e)}>Submit a new link</button>
          <button className='mockItButton'>Submit a new text post</button>
          <button className='mockItButton' onClick={(e) => createSubMockitHandler(e)}>Create your own submockit</button>
          <div id="mockItMenuSidebar">{props.sideBar}</div>
          {showSubscribeButton ? <div className='subscriptionContainer'>
            {switchSubscribeButton ? <button className='subscribe' onClick={subscribeHandler}>join</button> : null}
            {!switchSubscribeButton ? <button className='unsubscribe' onClick={unSubscribeHandler}>leave</button> : null}
            <div className='subcribers'>{subscribers} members</div>
          </div> : null}
          
        </div>
        {showCreateNewSubMockitMenu ?  <CreateSubMockitMenu closeForm={setShowCreateNewSubMockitMenu} /> : null}
        {showCreateNewLinkMenu ?  <CreateNewLinkMenu closeForm={setShowCreateNewLinkMenu} /> : null} 
      </div>


    );
  }
  
  export default MockItMenu;