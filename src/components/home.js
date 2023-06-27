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
import { onSnapshot, collection, collectionGroup, where, limit, query, useCollectionData, getDocs, getDoc, setDoc, doc, exists, orderBy, } from 'firebase/firestore'
import { useState, useEffect } from 'react';



function Home(props) {

const [threads, setThreads] = useState([])
const [loading, setLoading] = useState(true)


useEffect(() => {
  
  document.title = 'Mockit'
  const user = auth.currentUser;
  // if a user exists, loads the comments from the user's subscribed submockits, else it loads the default submockit posts 
  if(user){
    let updater = []
    setLoading(false)
    const currentUser = auth.currentUser;
    if(user){
      
      getDoc(doc(db, 'users', currentUser.uid)).then(userdocSnap => { 
        // Using the subscribedsubmockits array in the user doc to load documents from each submockit the user is subscribed to
        // const subMockitsArray = userdocSnap.data().subcribedSubMockits
        // subMockitsArray.forEach(submockit => {
          // const collectionRef = query(collection(db, "subMockIts", submockit, 'threads'), orderBy('postedAt'), limit(1));
          // const collectionRef = collection(db, "subMockIts", submockit, 'threads')
          const collectionRef = query(collectionGroup(db, "threads"), where("subMockItName", "in", userdocSnap.data().subcribedSubMockits ), orderBy("postedAt", 'desc'), limit(25))

          getDocs(collectionRef).then((snapShot) => {
            if(snapShot){
              snapShot.docs.forEach(thread => {
                const date = new Date(thread.data().postedAt)
                const date2 = new Date();
                const seconds = (date2.getTime() - date.getTime()) / 1000;

                const newThread = {
                  id: thread.id,
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
                // console.log(newThread)
                
                let newUpdater = []
                
                newUpdater = sortBest(updater, newUpdater)

                setThreads([...updater])
                setLoading(false)
            }
           })
        // })
      })
    }
    
    
  }
  else{
    const updater = []
    // grabs the newest 25 threads from all subreddit if no user is logged in
    const collectionRef = query(collectionGroup(db, "threads"), orderBy("postedAt", 'desc'), limit(25))
    getDocs(collectionRef).then((snapShot) => {
        if(snapShot){
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

              newUpdater = sortTimeNewest(updater, newUpdater)
            setThreads([...newUpdater])
            
        }
    }).then(() =>{
      setLoading(false)
    })
   
  }
 


}, [auth.currentUser])

  


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
                    })}</div>  : null}
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