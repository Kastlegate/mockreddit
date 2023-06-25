import '../style/Threads.css';
import { Link } from 'react-router-dom'
import { votesTotal } from './moreFunctions.js'


// Threads are used to create post in a submockit

function SubMockitThread(props) {

    
    const upVoteID = props.id + "upVote";
    const downvoteID = props.id + "downVote"
  
   
    return (
    <div className='threadContainer'>
        <div className='votesDisplay'>
            <div id={upVoteID} className='upvote'></div>
            <div className='totalVotes'>{props.totalVotes}</div>
            <div id={downvoteID} className='downvote'></div>
        </div>
      <div className="subMockitThread" id={props.id} >     
        <div className='linkAndSource'>
            <a  href={props.linkAddress} target={'_blank'}>{props.linkText}</a>
            <a href={props.link} >(news.com)</a>
        </div>

        <div className='whoWhenAndWhere'>
            submitted {props.postedAt} ago by <Link className='userSubMockitLink' to={"/u/" + props.user}>{props.user}</Link> to <Link className='subMockitLink' to={"/m/" + props.subMockItName}>{props.subMockItName}</Link>
        </div>

        <div className='commentsAndSharing'>
            {props.commentsTotal} <Link to={"/m/" + props.subMockItName + "/" + props.id + "/comments"}> comments</Link> share save hide
        </div>
      </div>
    </div>

    );
  }
  
  export default SubMockitThread;