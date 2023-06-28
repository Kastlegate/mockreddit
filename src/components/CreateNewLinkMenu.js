import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { app, db, auth, } from '../firebase/firebase-config'
import { addDoc, collection, getDocs, getDoc, setDoc, doc, exists } from 'firebase/firestore'
import { votesTotal } from './moreFunctions'
import '../style/createSubMockitMenu.css';

function CreateNewLinkMenu(props) {

    const { subMockit } = useParams()
    const [linkAddress, setlinkAddress] = useState('')
    const [threadTitle, setthreadTitle] = useState('')
    const [postTo, setpostTo] = useState(null)

    const showMainContent = () =>{
        let mainContent = document.querySelector('.SubMockitThread')
        mainContent.hidden = false;
        let mockItSideMenu = document.getElementById('mockItMenuContainer')
        mockItSideMenu.style.display = '';
        props.closeForm(false)
    }
    const submockitNamer = () => {

        if (postTo === null && subMockit){
            const name = subMockit
            setpostTo(name)
        }
        else if(postTo === '' && !subMockit){
            alert("Please put in a submockit to post to")
        }
        return postTo
        
    }

    const addHTTPS = (str) =>
    {
        
        if (!str.indexOf("http://") == 0 && !str.indexOf("https://") == 0) {
            str = "https://" + str 
            console.log(str)
            return str
    }

    else{
        return str
    }
}

submockitNamer()
    const handleSubmit = (e) => {
        e.preventDefault()
        submockitNamer()
        if(postTo){
            console.log(postTo)
            getDoc(doc(db, 'subMockIts', postTo)).then(docSnap => {
            
                
                if (docSnap.exists()) {
                    const currentuser = auth.currentUser;
                    getDoc(doc(db, 'users', currentuser.uid)).then(userdocSnap => {
                        if (userdocSnap.exists()) {
                            const docRef = addDoc(collection(db, "subMockIts", postTo, 'threads'), {
                                linkText: threadTitle,
                                linkAddress: addHTTPS(linkAddress),
                                postedAt: Date(),
                                downVoters: [],
                                upVoters: [currentuser.uid],
                                postedBy: userdocSnap.data().userName,
                                postedById: currentuser.uid,
                                subMockItName: postTo,
                                commentsTotal: 0,
                                voteScore: votesTotal(1, 0)
                            });
                       
                        
                            console.log("posted!");
                            showMainContent()
                        }
                        else{
                            console.log("broke it!")
                        }

                    })    
                } else {
                    alert("That subreddit does not exist!")
                }
            })
        }
        else{
            alert("Please put in a submockit to post to")
        }


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
                <div className='createSubmockItText'>url</div>
                <div className='createSubmockItSubText'></div>
                <input required type='text' className='createSubMockitForm' onChange={(e) => { setlinkAddress(e.target.value)}}></input>
            </label>
            <label className='createSubMockitFormItems'>
                <div className='createSubmockItText'>title</div>
                <div className='createSubmockItSubText'></div>
                <input required type='text' className='createSubMockitForm' onChange={(e) => { setthreadTitle(e.target.value)}}></input>
            </label>
            <label className='createSubMockitFormItems'>
                <div className='createSubmockItText'>choose where to post</div>
                <input  type='text' className='createSubMockitForm'  placeholder={subMockit} onChange={(e) => { setpostTo(e.target.value)}}></input>
            </label>
            <input className='submitButton' type="submit" value="create" ></input>
        </form>


    );
  }
  
  export default CreateNewLinkMenu;