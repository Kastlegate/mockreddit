import '../style/commentTemplate.css';
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { auth,  db } from '../firebase/firebase-config';
import { arrayUnion, updateDoc, doc, } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { votesTotal, } from './moreFunctions.js'



// Threads are used to create post in a submockit

function CommentTemplate(props) {

    const [replyCommentBox, setReplyCommentBox] = useState('');
    const { thread } = useParams()
    const { subMockit } = useParams()
    const [voteCount, setVoteCount] = useState(props.totalVotes)
    const orange = { borderBottomColor: 'orange'};
    const bluish = {borderTopColor:'rgb(0, 173, 221)'}
    const [upVoteColor, setUpvoteColor] = useState()
    const [downVoteColor, setDownVoteColor] = useState()



    //loads the colors for the initial votes for the logged in user
    useEffect (() =>{
        const user = auth.currentUser;
       if(user){
        if(props.upVoters.indexOf(user.uid) > -1){
            setUpvoteColor(orange)
            }
            else if(props.downVoters.indexOf(user.uid) > -1){
                setDownVoteColor(bluish)

            }
       }
    },[auth.currentUser])

  
    const handleReply = (e) => {
        let replyID= e.target.getAttribute("replydataset");
        let formID = document.querySelector('[data-formid='  + CSS.escape(replyID) +"]");
        formID.style.display = "flex";
        formID.flexdirection = "column";
        formID.width = "0px";
    }

    const handleThisReplySubmit = (e) =>{
        
       e.preventDefault()
       if (replyCommentBox !== ''){
        props.handleReplySubmit(e, replyCommentBox, props.path);
        setReplyCommentBox('')
        let formreplyID= e.target.getAttribute("formreplydataset");              
        let formID = document.querySelector('[data-formid='  + CSS.escape(formreplyID) +"]");
        formID.style.display = "none";
        formID.flexdirection = "column";
        formID.width = "0px";
       }
    }

    const handleCancelSubmit = (e) => {
        
        console.log('cancel')
        setReplyCommentBox('')
        let formreplyID= e.target.getAttribute("formreplydataset");              
        let formID = document.querySelector('[data-formid='  + CSS.escape(formreplyID) +"]");
        formID.reset()
        formID.style.display = "none";
        formID.flexdirection = "column";
        formID.width = "0px";
    }
    const handleUpVote = (e) => {
        const user = auth.currentUser;
        if(user){
            //if the upvote button was clicked
            if(e.target.getAttribute('data-upvoteid'))
            {
                const id = e.target.getAttribute('data-upvoteid');
                // let upvoteDiv = document.getElementById("upvote-" + id)
                const downvoteDiv = document.getElementById("downvote-" + id)
                //this if checks to see if the upvote had already been hit and removes the color from the div and user id from the array
                if(props.upVoters.indexOf(user.uid) > -1){
                    let index = props.upVoters.indexOf(user.uid)
                    //removes the current user from the upvoters array for the comment
                    console.log(props.upVoters)
                    props.upVoters.splice(index, 1)
                    console.log(props.upVoters)
                    updateDoc(doc(db, props.path), {
                        upVoters: props.upVoters,
                        voteScore: votesTotal(props.upVoters.length, props.downVoters.length)
                        })
                        setUpvoteColor()
                        
                        // e.target.style.borderBottomColor = 'rgb(149, 155, 163)';
                        setVoteCount(voteCount - 1)
                }

                    // this else if checks to see if the downvoter array has the user id in it and removes the color from the downvote div and user id from the array, and adds the color to the upvote div and adds the user to the upvoters array
                else if (props.downVoters.indexOf(user.uid) > -1){
                    let index = props.upVoters.indexOf(user.uid)
                    e.target.style.borderBottomColor = 'orange';
                    props.downVoters.splice(index, 1)
                    props.upVoters.push(user.uid)
                    updateDoc(doc(db, props.path), {
                        downVoters: props.downVoters,
                        upVoters: arrayUnion(user.uid),
                        voteScore: votesTotal(props.upVoters.length, props.downVoters.length)
                        })
                        setUpvoteColor(orange)
                        
                        setDownVoteColor()
                        setVoteCount(voteCount + 2)
                }
                else{
                    props.upVoters.push(user.uid)
                    updateDoc(doc(db, props.path), {
                        upVoters: arrayUnion(user.uid),
                        voteScore: votesTotal(props.upVoters.length, props.downVoters.length)
                        })
                        
                        setUpvoteColor(orange)
                    setVoteCount(voteCount + 1)
                }   


            }
            //if the downvote button was clicked
             if(e.target.getAttribute('data-downvoteid')){

              
                let id = e.target.getAttribute('data-downvoteid');
                let upvoteDiv = document.getElementById("upvote-" + id)
                // let downvoteDiv = document.getElementById("downvote-" + id)

                //this if checks to see if the downvote had already been hit and removes the color from the div and user id from the array
                if(props.downVoters.indexOf(user.uid) > -1){

                    let index = props.downVoters.indexOf(user.uid)
                    //removes the current user from the downvoters array for the comment
   
                    props.downVoters.splice(index, 1)
                    updateDoc(doc(db, props.path), {
                        downVoters: props.downVoters,
                        voteScore: votesTotal(props.upVoters.length, props.downVoters.length)
                        })
                        setDownVoteColor()
                        setVoteCount(voteCount + 1)
                    }

                    // this else if checks to see if the upvoter array has the user id in it and removes the color from the upvote div and user id from the array, and adds the color to the downvote div and adds the user to the downvoters array
                else if (props.upVoters.indexOf(user.uid) > -1){

                    let index = props.upVoters.indexOf(user.uid)
                    
                    props.upVoters.splice(index, 1)
                    props.downVoters.push(user.uid)
                    updateDoc(doc(db, props.path), {
                        upVoters: props.upVoters,
                        downVoters: arrayUnion(user.uid),
                        voteScore: votesTotal(props.upVoters.length, props.downVoters.length)
                        })
                        
                       setUpvoteColor()
                        setDownVoteColor(bluish)
                        setVoteCount(voteCount - 2)
                }
                else{
             
                    props.downVoters.push(user.uid)
                    updateDoc(doc(db, props.path), {
                        downVoters: arrayUnion(user.uid),
                        voteScore: votesTotal(props.upVoters.length, props.downVoters.length)
                        })
                        setDownVoteColor(bluish)
                      
                    setVoteCount(voteCount - 1)
                }   
                
            }
            




        }

    }
   
    return (
    <div className='commentContainer'>
        <div className='votesDisplay'>
            <div id={"upvote-" + props.id} style={upVoteColor} className='upvote' data-upvoteid={props.id} onClick={handleUpVote}></div>          
            <div id={"downvote-" + props.id} style={downVoteColor} className='commentdownvote' data-downvoteid={props.id} onClick={handleUpVote}></div>
        </div>
        <div>
            <div className='commentHeader'>
                <div className='commentCollapse'>[-]</div>
                <Link className='commentUserName'  to={"/u/" + props.user}>{props.user}</Link>
                <div className='headerItem'>{voteCount} points</div>
                <div className='headerItem'>{props.postedAt} ago</div>
            </div>
            <div className='commentText'>{props.comment}</div>
            <div className='commentFooter'>            
                <div className='footerItem'>permalink</div>
                <div className='footerItem'>embed</div>
                <div className='footerItem'>save</div>
                <div className='footerItem'>parent</div>
                <div className='footerItem'>report</div>
                <div className='footerItemReply' replydataset={props.id} onClick={handleReply}>reply</div>      
                </div>
                <form  className='replyForm' value={replyCommentBox}  formreplydataset={props.id} data-formid={props.id}  onSubmit={handleThisReplySubmit}>
                <textarea type='textArea' className='commentTextArea' placeholder='Reply to a comment' value={replyCommentBox} onChange={(e) => { setReplyCommentBox(e.target.value)}}></textarea>
                <div className='replyButtonContainer'>
                    <button type='submit' name='action' className='replyButton' value='submit'>save</button>
                    <button type='button' className='replyButton' formreplydataset={props.id} data-formid={props.id} onClick={handleCancelSubmit}>cancel</button>
                </div>
            </form>
        </div>

        {/* {props.checkVotes(props.upVoters, props.id)} */}

     
    </div>

    );
  }
  
  export default CommentTemplate;