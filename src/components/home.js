import Header from './header.js'
import UserNavBar from './userNavBar.js'
import { 
  getLengthOfTimeSincePosted,
  votesTotal, 
  sortTimeNewest,
  sortMostUpvotes,
  sortBest
 } from './moreFunctions.js'
import { useParams } from 'react-router-dom';
import '../style/home.css';
import SubMockitThread from './/Threads.js'
import MockItMenu from './/mockItMenu.js'
import SignUpForm from './/signUpForm.js'
import { db, auth } from '../firebase/firebase-config'
import { onSnapshot, collection, collectionGroup, where, limit, query, useCollectionData, getDocs, getDoc, setDoc, doc, exists,limitToLast, endBefore, orderBy, startAt, startAfter } from 'firebase/firestore'
import { useState, useEffect } from 'react';



function Home(props) {

const [threads, setThreads] = useState([])
const [loading, setLoading] = useState(true)
const [getLastDoc, setGetLastDoc] = useState(null)
const [getFirstDoc, setFirstDoc] = useState(null)
const [subbedMockits, setSubbedMockits] = useState(null)


const getCollectionRef = (ref) => {
  const updater = []

  getDocs(ref).then((snapShot) => {
      if(snapShot){
        if(snapShot.docs.length > 0){
          snapShot.docs.forEach(thread => {
            const date = new Date(thread.data().postedAt)
            const date2 = new Date();
            const seconds = (date2.getTime() - date.getTime()) / 1000;

              const newThread = { id: thread.id,
                postedAt: getLengthOfTimeSincePosted(thread.data().postedAt),
                secondsCounter: Number(seconds),
                linkAddress: thread.data().linkAddress,
                subMockItName: thread.data().subMockItName,
                postedBy: thread.data().postedBy,
                linkText: thread.data().linkText,
                votesTotal: votesTotal(thread.data().upVoters.length, thread.data().downVoters.length),
                upVoters: thread.data().upVoters,
                downVoters: thread.data().downVoters,
                commentsTotal: thread.data().commentsTotal,
                threadPath: thread.ref.path,
                }
                
                updater.push(newThread)
                setLoading(true)
          })

            let newUpdater = []
            setLoading(false)
            newUpdater = sortMostUpvotes(updater, newUpdater)
          setThreads([...newUpdater])
          setGetLastDoc(snapShot.docs[snapShot.docs.length -1])
          setFirstDoc(snapShot.docs[0])
          
      }
    }
  })
}


const getPrevThreads = () =>{
 
  const user = auth.currentUser;
  if(user){
    const prevcollectionRef = query(collectionGroup(db, "threads"), where("subMockItName", "in", subbedMockits ), 
    orderBy("voteScore", 'desc'), endBefore(getFirstDoc), 
    limitToLast(25));
  
    getCollectionRef(prevcollectionRef) 
  }else{
    const prevcollectionRef = query(collectionGroup(db, "threads"), 
    orderBy("voteScore", 'desc'), endBefore(getFirstDoc), 
    limitToLast(25));
  
    getCollectionRef(prevcollectionRef) 
  }
  
}

const getNextThreads = () => {
  
  const user = auth.currentUser;
  if(user){
    const nextcollectionRef = query(collectionGroup(db, "threads"), where("subMockItName", "in", subbedMockits ), orderBy("voteScore", 'desc'),  startAfter(getLastDoc || 0), limit(25));
      if(getLastDoc){
      getCollectionRef(nextcollectionRef)  
  }
  }

  else{
      
  const nextcollectionRef = query(collectionGroup(db, "threads"),
    orderBy("voteScore", 'desc'), 
    startAfter(getLastDoc || 0), limit(25));
  // const collectionRef = query(collectionGroup(db, "threads"), orderBy("postedAt", 'desc'), limit(15))

  if(getLastDoc){
      getCollectionRef(nextcollectionRef)  
  }
  }

}
  
  



useEffect(() => {
  
  document.title = 'Mockit'
  const user = auth.currentUser;



    auth.onAuthStateChanged(currentuser => {
      if(currentuser){
        
        getDoc(doc(db, 'users', currentuser.uid)).then(docSnap => {
          if (docSnap.exists()) {
            setSubbedMockits(docSnap.data().subcribedSubMockits)
              const collectionRef = query(collectionGroup(db, "threads"), where("subMockItName", "in", docSnap.data().subcribedSubMockits ), orderBy("voteScore", 'desc'), limit(25))
              getCollectionRef(collectionRef)
              
          } else {
            console.log("no user")
          }
        })
       
      }
      else{
        const collectionRef = query(collectionGroup(db, "threads"),  orderBy("voteScore", 'desc'), limit(25));
            getCollectionRef(collectionRef)
      }
    })





}, [])

  


    return (
      <div>
        <Header />
        <UserNavBar />

      <div id="mainContent" >

              {loading ? <div>...LOADING</div>  : null}

      {!loading ? <div className='SubMockitThread'>{threads.map((thread) => {
                      return (
                        <SubMockitThread id={thread.id} key={thread.id} linkAddress={thread.linkAddress} linkText={thread.linkText} postedAt={thread.postedAt} user={thread.postedBy} commentsTotal={thread.commentsTotal} upVoters={thread.upVoters} downVoters={thread.downVoters} path={thread.threadPath} subMockItName={thread.subMockItName} votesTotal={thread.votesTotal} />
                          )
                    })}<button  onClick={getPrevThreads}>prev</button><button  onClick={getNextThreads}>next</button></div>  : null}
         {/* <div className='SubMockitThread'>{threads.map((thread) => {
                      return (
                        <SubMockitThread id={thread.id} key={thread.id} linkAddress={thread.linkAddress} linkText={thread.linkText} postedAt={thread.postedAt} user={thread.postedBy} commentsTotal={thread.commentsTotal} upVoters={thread.upVoters} downVoters={thread.downVoters} path={thread.threadPath} subMockItName={thread.subMockItName} votesTotal={thread.votesTotal} />
                          )
                    })}</div> */}
        
       <MockItMenu />
      </div>
      </div>
    );
  }
  
  export default Home;