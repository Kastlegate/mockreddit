import Header from './header.js'
import UserNavBar from './userNavBar.js'
import { getLengthOfTimeSincePosted } from './moreFunctions.js'
import { useParams } from 'react-router-dom';
import '../style/home.css';
import SubMockitThread from './/Threads.js'
import MockItMenu from './/mockItMenu.js'
import SignUpForm from './/signUpForm.js'
import { db, auth } from '../firebase/firebase-config'
import { onSnapshot, collection, collectionGroup, where, query, useCollectionData, getDocs, getDoc, setDoc, doc, exists, orderBy, } from 'firebase/firestore'
import { useState, useEffect } from 'react';


function Home(props) {

const [threads, setThreads] = useState([])


useEffect(() => {
  

  const user = auth.currentUser;
  // if a user exists, loads the comments from the user's subscribed submockits, else it loads the default submockit posts 
  if(user){
    let updater = []
    
    const currentUser = auth.currentUser;
    if(currentUser){
      getDoc(doc(db, 'users', currentUser.uid)).then(userdocSnap => { 
        const subMockitsArray = userdocSnap.data().subcribedSubMockits
        subMockitsArray.forEach(submockit => {
          const collectionRef = collection(db, "subMockIts", submockit, 'threads');
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
                  upVoters: thread.data().upVoters.length,
                  downVoters: thread.data().downVoters.length,
                  commentsTotal: thread.data().commentsTotal,
                  }

                   updater.push(newThread)
            })
                              // console.log(newThread)
                             
                              let newUpdater = []
                              newUpdater =  updater.sort(function(a, b) { 
                               if (Number(a.secondsCounter) > Number(b.secondsCounter)) return 1;
                               if (Number(a.secondsCounter) < Number(b.secondsCounter)) return -1;
                               return 0;
                              })

                             setThreads([...newUpdater])

            }
           })
        })
       
  
      })
    }

    
  }
  else{
    const updater = []
    const collectionRef = query(collectionGroup(db, "threads"), orderBy("postedAt", 'desc'))
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
                  upVoters: thread.data().upVoters.length,
                  downVoters: thread.data().downVoters.length,
                  commentsTotal: thread.data().commentsTotal,
                  }
                  // console.log(newThread)
                  updater.push(newThread)
                  
            })

              let newUpdater = []
              newUpdater =  updater.sort(function(a, b) { 
              if (Number(a.secondsCounter) > Number(b.secondsCounter)) return 1;
              if (Number(a.secondsCounter) < Number(b.secondsCounter)) return -1;
              return 0;
              })

            setThreads([...newUpdater])
        }
    })
  }



}, [auth.currentUser])

  


    return (
      <div>
        <Header />
        <UserNavBar />

      <div id="mainContent" >
         <div className='SubMockitThread'>{threads.map((thread) => {
                      return (
                        <SubMockitThread id={thread.id} key={thread.id} linkAddress={thread.linkAddress} linkText={thread.linkText} postedAt={thread.postedAt} user={thread.postedBy} commentsTotal={thread.commentsTotal} subMockItName={thread.subMockItName} totalVotes={thread.totalVotes} />
                          )
                    })}</div>
        
       <MockItMenu />
      </div>
      </div>
    );
  }
  
  export default Home;