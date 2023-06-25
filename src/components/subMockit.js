import { useParams } from 'react-router-dom';
import MockItMenu from './/mockItMenu.js'
import SubMockitThread from './Threads.js';
import { db } from '../firebase/firebase-config'
import UserNavBar from './/userNavBar.js'
import { onSnapshot, collection, useCollectionData, getDocs, getDoc, setDoc, doc, exists, } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import Header from './header.js'
import { getLengthOfTimeSincePosted } from './moreFunctions.js'

function SubMockit(props) {

    // This submockit component displays the information from each route and creates the subMockit display
    const { subMockit } = useParams()
    const [ subMockitInfo, setSubmockitInfo ] = useState([])

    const [ sideBar, setSideBar] = useState('')
    const [ subMockitSubText, setSubMockitSubText] = useState('')
    const votesTotal = (upvotes, downvotes) => {
        let total = upvotes + downvotes;
        return total;
    }
     
    useEffect (() => {
        const collectionRef = collection(db, "subMockIts", subMockit, 'threads');

        //getdocs to get all of the docs in the submockit collection
        getDocs(collectionRef).then((snapShot) => {
            const updater = []

            snapShot.docs.forEach(thread => {
                //getdoc to get the username of the user that posted the thread
                // getDoc(doc(db, 'users', thread.data().postedBy)).then(docSnap => {
                    // if (docSnap.exists())  {
                        const newThread = {
                            linkAddress: thread.data().linkAddress,
                            linkText: thread.data().linkText,
                            postedAt: getLengthOfTimeSincePosted(thread.data().postedAt),
                            postedBy: thread.data().postedBy, 
                            subMockItName: thread.data().subMockItName,
                            totalVotes: votesTotal(thread.data().upVoters.length, thread.data().downVoters.length),
                            commentsTotal: thread.data().commentsTotal,
                            id: thread.id
                        }
                         
                        updater.push(newThread)
                        setSubmockitInfo([...updater])
                       
                    // } else {
                    //   console.log("no user")
                    // }
                    
                // })
                 
            });
         
        }) 

        getDoc(doc(db, 'subMockIts', subMockit)).then(docSnap => {
            //if to make sure the submockit does not already exist
            if (docSnap.exists()) {
              setSideBar(docSnap.data().sidebar)
              setSubMockitSubText(docSnap.data().title)
              document.title = docSnap.data().title
            //   document.getElementById('logo').textContent = docSnap.data().title
            } else {
                //if the submockit does not exist, this creates the submockit
                console.log(subMockit + " does not exist");
            }
          })

    }, [subMockit])

// useEffect(() => {
//     console.log(subMockitInfo)
// },[subMockitInfo])

   
    return (
        <div>
            <Header />
            <UserNavBar subText={subMockitSubText}/>
    <div id="mainContent" >  
        <div className='SubMockitThread'>{subMockitInfo.map((thread) => {
                      return (
                        <SubMockitThread id={thread.id} key={thread.id} linkAddress={thread.linkAddress} linkText={thread.linkText} postedAt={thread.postedAt} commentsTotal={thread.commentsTotal} user={thread.postedBy} subMockItName={thread.subMockItName} totalVotes={thread.totalVotes} />
                          )
                    })}</div>
     
      <MockItMenu sideBar = {sideBar}/>
    </div>
    </div>

    );
  }
  
  
  export default SubMockit;