import { useParams } from 'react-router-dom';
import MockItMenu from './/mockItMenu.js'
import SubMockitThread from './Threads.js';
import { db } from '../firebase/firebase-config'
import UserNavBar from './/userNavBar.js'
import { onSnapshot, collection, useCollectionData, getDocs, getDoc, setDoc, doc, exists, limit, limitToLast, endBefore, query, orderBy, startAt, startAfter } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import Header from './header.js'
import { getLengthOfTimeSincePosted, votesTotal } from './moreFunctions.js'

function SubMockit(props) {

    // This submockit component displays the information from each route and creates the subMockit display
    const { subMockit } = useParams()
    const [ subMockitInfo, setSubmockitInfo ] = useState([])

    const [ sideBar, setSideBar] = useState('')
    const [ subMockitSubText, setSubMockitSubText] = useState('')
    const [getLastDoc, setGetLastDoc] = useState(null)
    const [getFirstDoc, setFirstDoc] = useState(null)
    

    const getCollectionRef = (ref) =>{

        //getdocs to get all of the docs in the submockit collection
        getDocs(ref).then((snapShot) => {
 
            if(snapShot.docs.length > 0){
            const updater = []
            snapShot.docs.forEach(thread => {

                        const newThread = {
                            linkAddress: thread.data().linkAddress,
                            linkText: thread.data().linkText,
                            postedAt: getLengthOfTimeSincePosted(thread.data().postedAt),
                            postedBy: thread.data().postedBy, 
                            subMockItName: thread.data().subMockItName,
                            votesTotal: votesTotal(thread.data().upVoters.length, thread.data().downVoters.length),
                            commentsTotal: thread.data().commentsTotal,
                            upVoters: thread.data().upVoters,
                            downVoters: thread.data().downVoters,
                            id: thread.id,
                            threadPath: thread.ref.path,
                        }
                        updater.push(newThread)
                      
                        
                       
                    // } else {
                    //   console.log("no user")
                    // }
                    
                // })
                 
            });
            setSubmockitInfo([...updater])
           

           
                setGetLastDoc(snapShot.docs[snapShot.docs.length -1])
             setFirstDoc(snapShot.docs[0])

          } 
        }) 
   
    }  
const getPrevThreads = () =>{
    const prevcollectionRef = query(collection(db, "subMockIts", subMockit, 'threads'),  orderBy("postedAt"), endBefore(getFirstDoc), limitToLast(25));
 
    getCollectionRef(prevcollectionRef)  
    
}

const getNextThreads = () => {
    const nextcollectionRef = query(collection(db, "subMockIts", subMockit, 'threads'),  orderBy("postedAt"), startAfter(getLastDoc || 0), limit(25));

    if(getLastDoc){
        getCollectionRef(nextcollectionRef)  
    }
}
     
useEffect (() => {
    const collectionRef = query(collection(db, "subMockIts", subMockit, 'threads'), orderBy("postedAt"),  limit(25));

    getCollectionRef(collectionRef)


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


   
    return (
        <div>
            <Header />
            <UserNavBar subText={subMockitSubText}/>
    <div id="mainContent" >  
        <div className='SubMockitThread'>{subMockitInfo.map((thread) => {
                      return (
                        <SubMockitThread id={thread.id} key={thread.id} linkAddress={thread.linkAddress} linkText={thread.linkText} postedAt={thread.postedAt} commentsTotal={thread.commentsTotal} upVoters={thread.upVoters} downVoters={thread.downVoters} user={thread.postedBy} subMockItName={thread.subMockItName} path={thread.threadPath} votesTotal={thread.votesTotal} />
                          )
                    })}<button  onClick={getPrevThreads}>prev</button><button  onClick={getNextThreads}>next</button></div>
        
      <MockItMenu sideBar = {sideBar}/>
    </div>
    </div>

    );
  }
  
  
  export default SubMockit;