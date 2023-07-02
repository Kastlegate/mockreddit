import { useParams } from 'react-router-dom';
import MockItMenu from './/mockItMenu.js'
import SubMockitThread from './Threads.js';
import { db, auth } from '../firebase/firebase-config'
import CommentTemplate from './commentTemplate.js';
import { onSnapshot, collection, updateDoc, serverTimestamp, getDocs, getDoc, query, doc, orderBy, addDoc } from 'firebase/firestore'
import '../style/comments.css';
import { useEffect, useState } from 'react';
import UserNavBar from './/userNavBar.js'
import Header from './header.js'
import { getLengthOfTimeSincePosted } from './moreFunctions.js'

function Comments(props) {

const { thread } = useParams()
const { subMockit } = useParams()
const [currentThread, setCurrentThread] = useState({upVoters:[], downVoters: [], linkAddress: 'https://mockreddit-22590.web.app/'})
const [threadComments, setThreadComments] = useState([])
const [newCommentBox, setNewCommentBox] = useState('')
const [commentStateUpdater, setCommentStateUpdater] = useState(false)
const [commentsCount, setCommentsCount] = useState(0)
const [finishedLoading, setFinishedLoading] = useState(false)
const [sideBar, setSideBar] = useState('')
const [ subMockitSubText, setSubMockitSubText] = useState('')
const [resetColor, setResetColor] = useState(1)
const [resetName, setResetName] = useState(1)
const [sortValue, setSortValue] = useState('timestamp') 


const votesTotal = (upvotes, downvotes) => {
   
    let total = upvotes - downvotes;
    return total;
}

 const getChildReplies = (collectionPath) =>{
   
        // let childrenReplies = [];
        // childrenReplies = [...childrenIds]
        const subcollectionRef = collection(db, collectionPath);
        let parentRepliesArray = [];

        getDocs(subcollectionRef).then((snapShot) => {
            const updater = []
            if (snapShot){
                snapShot.forEach(element => {
                    // getDoc(doc(db, "subMockIts", subMockit, 'threads', thread, 'comments', element)).then(docSnap => {
                        // if (docSnap.exists())  {
        
                            // getDoc(doc(db, 'users', element.data().postedBy)).then(name => {
                                if (element.exists())  {
                                    const newComment = {
                                        totalVotes: votesTotal(element.data().upVoters.length, element.data().downVoters.length),
                                        comment: element.data().comment,
                                        postedBy: element.data().postedBy,
                                        id: element.id,
                                        postedAt: getLengthOfTimeSincePosted(element.data().postedAt),
                                        children: element.data().children,
                                        replies: [],
                                        parent: element.data().parent,
                                        upVoters: element.data().upVoters,
                                        downVoters: element.data().downVoters,
                                        commentPath: element.ref.path,
                                        timestamp: getLengthOfTimeSincePosted(element.data().timestamp),
                                    } 
                                     
                                        parentRepliesArray.push(newComment)
                                        // if (newComment.children){
                                            newComment.replies =  getChildReplies(element.ref.path + '/comments')
                                        // }
                                        // checkVotes(newComment)
                                } else {
                                  console.log("no user")
                                }
                                
                            // })
                       
                       
        
        
                        // }
                        // else{
                        //     console.log("error")
                        // }
        
                    // })
                });
            }
           
        }) 

   
        setCommentStateUpdater([true])
   return parentRepliesArray;
 
 }
 
const getComments = () =>{

    const collectionRef = query(collection(db, "subMockIts", subMockit, 'threads', thread, 'comments'), orderBy(sortValue, 'desc'));
    //getdocs to get all of the comments in the thread's comments collection
    getDocs(collectionRef).then((snapShot) => {
        const updater = []
        if (snapShot){
            snapShot.docs.forEach(thread => {
          
                //getdoc to get the username of the user that posted the thread
                // getDoc(doc(db, 'users', thread.data().postedBy)).then(docSnap => {
                //     if (docSnap.exists())  {
                       const newComment = {
                        totalVotes: votesTotal(thread.data().upVoters.length, thread.data().downVoters.length),
                        comment: thread.data().comment,
                        postedBy: thread.data().postedBy,
                        id: thread.id,
                        postedAt: getLengthOfTimeSincePosted(thread.data().postedAt),
                        children: thread.data().children,
                        replies: [],
                        parent: thread.data().parent,
                        upVoters: thread.data().upVoters,
                        downVoters: thread.data().downVoters,
                        commentPath: thread.ref.path,
                        timestamp: getLengthOfTimeSincePosted(thread.data().timestamp),
                       }
                       const subcollectionRef = thread.ref.path + '/comments';
                    //    console.log(newComment.commentPath)


                       

                    newComment.replies = getChildReplies(subcollectionRef)

                           
                        // }
                        // else{
                        //     console.log("no")
                        // }

                        updater.push(newComment)
                       
                    //    checkVotes(newComment)
                    //    setCommentStateUpdater([true])
                    // } else {
                    //   console.log("no user")
                    // }
                    
                // })
                
                 
            });
        }
        setThreadComments([...updater])
    }) 
      

}

const handleSubmit = (e) =>{
    e.preventDefault()
    // checking for a user before handling the submit
    const user = auth.currentUser;
    if(user){
        if(newCommentBox != ''){
               
               getDoc(doc(db, 'users', user.uid)).then(docSnap => {
                                //adds the comment to the current thread's comments
                const docRef = addDoc(collection(db, "subMockIts", subMockit, 'threads', thread, 'comments'), {
                    comment: newCommentBox,
                    postedAt: Date(),
                    postedBy: docSnap.data().userName,
                    postedById: user.uid,
                    children: [],
                    parent: "",
                    upVoters: [user.uid],
                    downVoters: [],
                    postedTo: subMockit,
                    thread: thread,
                    linkText: currentThread.linkText,
                    linkAddress: currentThread.linkAddress,
                    voteScore: votesTotal(1, 0),
                    timestamp: serverTimestamp()
                });
                                })


            updateDoc(doc(db, 'subMockIts', subMockit, 'threads', thread), {
                commentsTotal: commentsCount + 1
                })
                setCommentsCount(commentsCount + 1)
            getComments()
            setNewCommentBox('')
            // setNewCommentAdded(true)
        }
        // else{
        //     alert('please enter text')
        // }
    }
    else{
        alert('please log in or create an account to post')
    }

}


const handleReply = (e, value, path) => {
    e.preventDefault()
    let parentId = e.target.getAttribute("data-formid");
    const user = auth.currentUser;
    if(user){
        if(value != ''){
            getDoc(doc(db, 'users', user.uid)).then(docSnap => {
                //adds the comment to the current thread's comments
            const docRef = addDoc(collection(db, path, 'comments'), {
                comment: value,
                postedAt: Date(),
                postedBy: docSnap.data().userName,
                postedById: user.uid,
                children: [],
                parent: parentId,
                upVoters: [user.uid],
                downVoters: [],
                postedTo: subMockit,
                thread: thread,
                linkText: currentThread.linkText,
                linkAddress: currentThread.linkAddress,
                voteScore: votesTotal(1, 0),
                timestamp: serverTimestamp(),                    
            })
        
                    // updates the number of comments on the thread
                updateDoc(doc(db, 'subMockIts', subMockit, 'threads', thread), {
                    commentsTotal: commentsCount + 1
                    })
                    setCommentsCount(commentsCount + 1)
            })

        }
    }

    getComments()

}
// takes the child arrays from the parent comment and populates the children to the parent at render
const addRepliesToComment = (nestedCommentReplies, counter) =>{
    
     let count = counter;
     
       
        
        return <div className='repliesContainer'  style={{margin: 0 + "px " + 0 + "px " + 0 + "px " + 20 + "px "}}>{nestedCommentReplies.map((thisReply) => {
            
            
           
            return (
                <div key={thisReply.id}  >
                 <div > 
                <CommentTemplate id={thisReply.id} postedAt={thisReply.postedAt} user={thisReply.postedBy} totalVotes={thisReply.totalVotes} comment={thisReply.comment}  downVoters={thisReply.downVoters}  upVoters={thisReply.upVoters} path={thisReply.commentPath} handleReplySubmit={handleReply} /> </div>               
              
                {addRepliesToComment(thisReply.replies, count)}</div>
    
              
                )
          })}</div>
    
     
}




useEffect (() => {


    getDoc(doc(db, 'subMockIts', subMockit)).then(docSnap => {
        //if to make sure the submockit does not already exist
        if (docSnap.exists()) {
            setSubMockitSubText(docSnap.data().title)
            document.title = docSnap.data().title
            setSideBar(document.getElementById('mockItMenuSidebar').textContent = docSnap.data().sidebar)
        } else {
            //if the submockit does not exist, this creates the submockit
            console.log(subMockit + " does not exist");
        }
      })
    

    

    getDoc(doc(db, 'subMockIts', subMockit, 'threads', thread)).then(docSnap => {
        //if to make sure the submockit does not already exist
        if (docSnap.exists()) {
            //nested docsnap to grab the username
                    const newThread = { 
                        linkAddress: docSnap.data().linkAddress,
                        linkText: docSnap.data().linkText,
                        postedAt: getLengthOfTimeSincePosted(docSnap.data().postedAt),
                        postedBy: docSnap.data().postedBy,                 
                        subMockItName: docSnap.data().subMockItName,
                        votesTotal: votesTotal(docSnap.data().upVoters.length, docSnap.data().downVoters.length),
                        id: docSnap.id,
                        upVoters: docSnap.data().upVoters,
                        downVoters: docSnap.data().downVoters,
                        commentsTotal: docSnap.data().commentsTotal,
                        threadPath: docSnap.ref.path
                    }
                    console.log(newThread.postedBy)
                    setCurrentThread(newThread)
                    setCommentsCount(docSnap.data().commentsTotal)
                    setResetColor(2)
                    setResetName(2)
  
                        
        } else {
            //if the submockit does not exist, this creates the submockit
            console.log("thread does not exist");
        }
      })
      
}, [])

useEffect (() => {

    getComments()
 
      
}, [sortValue])


    return (
        <div><Header />
            <UserNavBar sort={setSortValue} subText={subMockitSubText}/>
    <div id="mainContent" > 
        <div className='SubMockitThread' margin-left="5px">
            <SubMockitThread id={currentThread.id} linkAddress={currentThread.linkAddress} linkText={currentThread.linkText} postedAt={currentThread.postedAt} user={currentThread.postedBy} path={currentThread.threadPath} upVoters={currentThread.upVoters} downVoters={currentThread.downVoters} resetColor={resetColor} resetName={resetName} subMockItName={currentThread.subMockItName} commentsTotal = {commentsCount} votesTotal={currentThread.votesTotal} />

            <div>{commentsCount} comments</div>
            <div className='divider'></div>
            <div className='sortText'>sorted by: best</div>
            <form className='newCommentForm' onSubmit={(e) => handleSubmit(e)}>
                <textarea type='textArea' className='commentTextArea' placeholder='Make a new comment' value={newCommentBox} onChange={(e) => { setNewCommentBox(e.target.value)}}></textarea>
                <button className='newCommentButton'>save</button>
            </form>
            <div>{threadComments.map((comments) => {

                      return (
                        <div key={comments.id}  className='parentComment'>
                            <CommentTemplate id={comments.id}  postedAt={comments.postedAt} user={comments.postedBy} totalVotes={comments.totalVotes}  comment={comments.comment} upVoters={comments.upVoters} path={comments.commentPath} downVoters={comments.downVoters} handleReplySubmit={handleReply}  />
                            {addRepliesToComment(comments.replies, 1)}
                        </div>
                        
                        
                          )
                    })}</div>
    

        </div> 
        
        <MockItMenu sideBar = {sideBar}/>
    </div>
    </div>

    );
  }
  
  
  export default Comments;