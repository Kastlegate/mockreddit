import { useState, useEffect, useRef } from 'react';
import { app, db, auth, } from '../firebase/firebase-config'
import { onSnapshot, collection, getDocs, getDoc, setDoc, doc, exists } from 'firebase/firestore'
import '../style/createSubMockitMenu.css';

function CreateSubMockitMenu(props) {


    const [subMockItName, setSubMockitName] = useState('')
    const [subMockitTitle, setSubMockItTitle] = useState('')
    const [sidebar, setSideBar] = useState('')

    const showMainContent = () =>{
        let mainContent = document.querySelector('.SubMockitThread')
        mainContent.hidden = false;
        let mockItSideMenu = document.getElementById('mockItMenuContainer')
        mockItSideMenu.style.display = '';
        props.closeForm(false)
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        getDoc(doc(db, 'subMockIts', subMockItName)).then(docSnap => {
            //if to make sure the submockit does not already exist
            if (docSnap.exists()) {
              console.log("this submockit already exists");
            } else {
                //if the submockit does not exist, this creates the submockit
                setDoc(doc(db, 'subMockIts', subMockItName), {
                        title: subMockitTitle,
                        sidebar: sidebar,
                        admin: auth.currentUser.uid,
                        subscribers: [],
                  })
            }
          })


        showMainContent()
    } 

// creates a useEffect that checks to see if a click has occurred outside the form
let createSubMockitRef = useRef()
useEffect(() => {

    let handler = (e) => {
      if(!createSubMockitRef.current?.contains(e.target)){
                showMainContent()
      }
    }
  
    document.addEventListener("mousedown", handler) 
    //Removing the eventlistner from the dom after the useeffect has run 
    return () => {
      document.removeEventListener("mousedown", handler)
    }
  
  },[])
  
  


   
    return (

        <form ref={createSubMockitRef} id="createSubMockitForm" onSubmit={(e) => handleSubmit(e)}>

            <label className='createSubMockitFormItems'>
                <div className='createSubmockItText'>Name</div>
                <div className='createSubmockItSubText'> no spaces, e.g., "books" or "bookclub". avoid using solely trademarked names, e.g. use "FansOfAcme" instead of "Acme". once chosen, this name cannot be changed.</div>
                <input required type='text' className='createSubMockitForm' onChange={(e) => { setSubMockitName(e.target.value)}}></input>
            </label>
            <label className='createSubMockitFormItems'>
                <div className='createSubmockItText'>Title</div>
                <div className='createSubmockItSubText'>e.g., books: made from trees or pixels. recommendations, news, or thoughts</div>
                <input required type='text' className='createSubMockitForm' onChange={(e) => { setSubMockItTitle(e.target.value)}}></input>
            </label>
            <label className='createSubMockitFormItems'>
                <div className='createSubmockItText'>Side Bar</div>
                <div className='createSubmockItSubText'>shown in the sidebar of your submockit.</div>
                <input required type='text' className='createSubMockitForm' onChange={(e) => { setSideBar(e.target.value)}}></input>
            </label>
            <input className='submitButton' type="submit" value="create" ></input>
        </form>


    );
  }
  
  export default CreateSubMockitMenu;