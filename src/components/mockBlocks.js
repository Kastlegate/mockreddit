import '../style/subMockits.css';


function SubMockitThread(props) {



  
   
    return (

      <div className="subMockitThread" id={props.id} >
        <div className='linkAndSource'>
            <a  href={props.link}>{props.linkText}</a>
            <a href={props.link} >(news.com)</a>
        </div>

        <div className='whoWhenAndWhere'>
            submitted {props.timeStamp} ago by <a className='userSubMockitLink' href={props.link}>{props.user}</a> to <a className='subMockitLink' href={props.link}>{props.subMockIt}</a>
        </div>

        <div className='commentsAndSharing'>
            {props.commentCount} comments share save hide
        </div>

      </div>

    );
  }
  
  export default SubMockitThread;