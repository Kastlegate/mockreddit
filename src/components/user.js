import { useParams, Link } from 'react-router-dom';
import MockItMenu from './/mockItMenu.js'
import UserNavBar from './/userNavBar.js'
import UserComments from './usercomment.js';
import { db, auth } from '../firebase/firebase-config'
import { onSnapshot, collection, collectionGroup, where, query, useCollectionData, getDocs, getDoc, setDoc, doc, exists, } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import Header from './header.js'
import { getLengthOfTimeSincePosted } from './moreFunctions.js'

function User(props) {

    const { user } = useParams()
    const [userName, setUserName] = useState('')
    const [comments, setComments] = useState([])
    const votesTotal = (upvotes, downvotes) => {
   
        let total = upvotes - downvotes;
        return total;
    }

    const initialVoteLoader = (element, userID) => {

        if(element.upVoters.indexOf(userID) > -1){
            let upvote = document.getElementById("upvote-" + element.id)
            upvote.style.borderBottomColor = 'orange'
            }
            else if(element.downVoters.indexOf(userID) > -1){
            let downvote = document.getElementById("downvote-" + element.id)
            downvote.style.borderTopColor = 'rgb(0, 173, 221)'
            }
        }    


useEffect(() => {

    const updater = [] 
    const collectionRef = query(collectionGroup(db, "comments"), where("postedBy", "==", user))
    getDocs(collectionRef).then((snapShot) => {
        if(snapShot){
            snapShot.docs.forEach(comment => {

                const date = new Date(comment.data().postedAt)
                const date2 = new Date();
                const seconds = (date2.getTime() - date.getTime()) / 1000;

                const newComment = {
                    totalVotes: votesTotal(comment.data().upVoters.length, comment.data().downVoters.length),
                    comment: comment.data().comment,
                    postedBy: comment.data().postedBy,
                    postedTo: comment.data().postedTo,
                    secondsCounter: seconds,
                    id: comment.id,
                    postedAt: getLengthOfTimeSincePosted(comment.data().postedAt),
                    replies: [],
                    parent: comment.data().parent,
                    upVoters: comment.data().upVoters,
                    downVoters: comment.data().downVoters,
                    thread: comment.data().thread,
                    linkAddress: comment.data().linkAddress,
                    linkText: comment.data().linkText, 
                    commentPath: comment.ref.path,
                   }
                  
                   updater.push(newComment)
                   let newUpdater = []
                              newUpdater =  updater.sort(function(a, b) { 
                               if (Number(a.secondsCounter) > Number(b.secondsCounter)) return 1;
                               if (Number(a.secondsCounter) < Number(b.secondsCounter)) return -1;
                               return 0;
                              })

                             setComments([...newUpdater])
                //    setComments([...updater])
                   document.title = "u/" + user



                   
            })
        }
    })

}, [user])

// useEffect (() => {
  
//     if (comments){

       
//         comments.forEach(element => {
           
//             const user = auth.currentUser;
//             if(user){
//                 const id = user.uid
               
//                 try {
//                     initialVoteLoader(element, id)
//                 } catch(error){
//                     console.log("upvote div had not loaded")
//                     }
//                 }
            
           
//         })
    
//     }
// });


    return (
        <div>
            <Header />
            <UserNavBar />
         <div id="mainContent" >  
    
    <div className='SubMockitThread'>{comments.map((thread) => {
                  return (
                    <div key={thread.id}>
                    <UserComments id={thread.id}  postedAt={thread.postedAt} postedTo={thread.postedTo} user={thread.postedBy} totalVotes={thread.totalVotes} linkAddress={thread.linkAddress} comment={thread.comment} upVoters={thread.upVoters} path={thread.commentPath} downVoters={thread.downVoters}  postedToThread={thread.thread} linkText={thread.linkText}    />
                    </div>
                      )
                })}</div>
 
  <MockItMenu />
</div>
        </div>
   

    );
  }
  
  
  export default User;