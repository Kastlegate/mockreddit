import '../style/userComment.css';
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { auth,  db } from '../firebase/firebase-config';
import { arrayUnion, updateDoc, doc, } from 'firebase/firestore';


// Threads are used to create post in a submockit

function UserComments(props) {

    const [voteCount, setVoteCount] = useState(props.totalVotes)

    const handleUpVote = (e) => {
        const user = auth.currentUser;
        if(user){
            //if the upvote button was clicked
            if(e.target.getAttribute('data-upvoteid'))
            {
                let id = e.target.getAttribute('data-upvoteid');
                // let upvoteDiv = document.getElementById("upvote-" + id)
                let downvoteDiv = document.getElementById("downvote-" + id)
                //this if checks to see if the upvote had already been hit and removes the color from the div and user id from the array
                if(props.upVoters.indexOf(user.uid) > -1){
                    let index = props.upVoters.indexOf(user.uid)
                    //removes the current user from the upvoters array for the comment
                    props.upVoters.splice(index, 1)
                    updateDoc(doc(db, props.path), {
                        upVoters: props.upVoters
                        })
                        e.target.style.borderBottomColor = 'rgb(149, 155, 163)';
                        setVoteCount(voteCount - 1)
                    }

                    // this else if checks to see if the downvoter array has the user id in it and removes the color from the downvote div and user id from the array, and adds the color to the upvote div and adds the user to the upvoters array
                else if (props.downVoters.indexOf(user.uid) > -1){
                    let index = props.upVoters.indexOf(user.uid)
                    e.target.style.borderBottomColor = 'orange';
                    props.downVoters.splice(index, 1)
                    updateDoc(doc(db, props.path), {
                        downVoters: props.downVoters,
                        upVoters: arrayUnion(user.uid)
                        })
                        e.target.style.borderBottomColor = 'orange';
                        downvoteDiv.style.borderTopColor = 'rgb(149, 155, 163)';
                        setVoteCount(voteCount + 1)
                }
                else{
                    updateDoc(doc(db, props.path), {
                        upVoters: arrayUnion(user.uid)
                        })
                    e.target.style.borderBottomColor = 'orange';
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
                    console.log("1")
                    let index = props.downVoters.indexOf(user.uid)
                    //removes the current user from the downvoters array for the comment
                    props.downVoters.splice(index, 1)
                    updateDoc(doc(db, props.path), {
                        downVoters: props.downVoters
                        })
                        e.target.style.borderTopColor = 'rgb(149, 155, 163)';
                        setVoteCount(voteCount + 1)
                    }

                    // this else if checks to see if the upvoter array has the user id in it and removes the color from the upvote div and user id from the array, and adds the color to the downvote div and adds the user to the downvoters array
                else if (props.upVoters.indexOf(user.uid) > -1){
                    let index = props.downVoters.indexOf(user.uid)
                    
                    props.upVoters.splice(index, 1)
                    updateDoc(doc(db, props.path), {
                        upVoters: props.upVoters,
                        downVoters: arrayUnion(user.uid)
                        })
                       upvoteDiv.style.borderBottomColor = 'rgb(149, 155, 163)';
                        e.target.style.borderTopColor = 'rgb(0, 173, 221)';
                        setVoteCount(voteCount - 1)
                }
                else{
                    updateDoc(doc(db, props.path), {
                        downVoters: arrayUnion(user.uid)
                        })
                    e.target.style.borderTopColor = 'rgb(0, 173, 221)';
                    setVoteCount(voteCount - 1)
                }   
                
            }
            




        }

    }
  
   
    return (
    <div> <a className='headerLink' href={props.linkAddress} rel="noopener" target={'_blank'}>{props.linkText}</a> 
    <div className='threadContainer'>
        <div className='votesDisplay'>
            <div id={"upvote-" + props.id} className='upvote' data-upvoteid={props.id} onClick={handleUpVote}></div>          
            <div id={"downvote-" + props.id} className='downvote' data-downvoteid={props.id} onClick={handleUpVote} ></div>
        </div>
        <div>
            <div className='commentHeader'>
                <div className='commentCollapse'>[-]</div>
                <Link className='userheaderItem'  to={"/u/" + props.user}>{props.user}</Link>
                <div className='headerItem'>{props.totalVotes} points</div>
                <div className='headerItem'>{props.postedAt} ago</div>
                <div>to <Link className='userheaderItem'  to={"/m/" + props.postedTo}>{props.postedTo}</Link></div>
            </div>
            <div className='commentText'>{props.comment}</div>
            <div className='commentFooter'>            
                <div className='footerItem'>permalink</div>
                <Link className='footerItem' to={"/m/" + props.postedTo + "/" + props.postedToThread + "/comments" }>full comments</Link>
                <div className='footerItem'>embed</div>
                <div className='footerItem'>save</div>
                <div className='footerItem'>parent</div>
                <div className='footerItem'>report</div>    
                </div>
                
        </div>
    </div>
    </div>
    );
  }
  
  export default UserComments;