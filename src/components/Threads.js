import '../style/Threads.css';
import { Link } from 'react-router-dom'
import { votesTotal } from './moreFunctions.js'
import { useState, useEffect } from 'react';
import { auth,  db } from '../firebase/firebase-config';
import { arrayUnion, updateDoc, doc, } from 'firebase/firestore';


// Threads are used to create post in a submockit

function SubMockitThread(props) {

    
    const upVoteID = props.id + "upVote";
    const downvoteID = props.id + "downVote"

    const [voteCount, setVoteCount] = useState(props.totalVotes)
    const orange = {borderBottomColor: 'orange'};
    const bluish = {borderTopColor:'rgb(0, 173, 221)'}
    const [upVoteColor, setUpvoteColor] = useState()
    const [downVoteColor, setDownVoteColor] = useState()

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
    },[props.resetColor])



 
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
  
                    props.upVoters.splice(index, 1)
                    updateDoc(doc(db, props.path), {
                        upVoters: props.upVoters
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
                    updateDoc(doc(db, props.path), {
                        downVoters: props.downVoters,
                        upVoters: arrayUnion(user.uid)
                        })
                        setUpvoteColor(orange)
                        props.upVoters.push(user.uid)
                        setDownVoteColor()
                        setVoteCount(voteCount + 2)
                }
                else{
                    updateDoc(doc(db, props.path), {
                        upVoters: arrayUnion(user.uid)
                        })
                        props.upVoters.push(user.uid)
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
                        downVoters: props.downVoters
                        })
                        setDownVoteColor()
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
                        props.downVoters.push(user.uid)
                       setUpvoteColor()
                        setDownVoteColor(bluish)
                        setVoteCount(voteCount - 2)
                }
                else{
                    updateDoc(doc(db, props.path), {
                        downVoters: arrayUnion(user.uid)
                        })
                        setDownVoteColor(bluish)
                        props.downVoters.push(user.uid)
                    setVoteCount(voteCount - 1)
                }   
                
            }
            




        }

    }
  
   
    return (
    <div className='threadContainer'>
        <div className='votesDisplay'>
            <div id={upVoteID} className='upvote' style={upVoteColor} data-upvoteid={props.id} onClick={handleUpVote}></div>
            <div className='totalVotes'>{props.totalVotes}</div>
            <div id={downvoteID} className='downvote'style={downVoteColor} data-downvoteid={props.id}  onClick={handleUpVote}></div>
        </div>
      <div className="subMockitThread" id={props.id} >     
        <div className='linkAndSource'>
            <a className='outsideLink' href={props.linkAddress} target={'_blank'}>{props.linkText}</a>
            <a href={props.link} >(news.com)</a>
        </div>

        <div className='whoWhenAndWhere'>
            submitted {props.postedAt} ago by <Link  className='subMockItLink' to={"/u/" + props.user}>{props.user}</Link> to <Link className='subMockItLink' to={"/m/" + props.subMockItName}>{props.subMockItName}</Link>
        </div>

        <div className='commentsAndSharing'>
            {props.commentsTotal} <Link to={"/m/" + props.subMockItName + "/" + props.id + "/comments"} className='subMockItLink' > comments</Link> share save hide
        </div>
      </div>
    </div>

    );
  }
  
  export default SubMockitThread;