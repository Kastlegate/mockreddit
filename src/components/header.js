import '../style/header.css';
import { onSnapshot, collection, getDocs, getDoc, setDoc, doc, exists } from 'firebase/firestore'
import { app, db, auth } from '../firebase/firebase-config'
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'


function Header(props) {

  const [listOfsubscribedSubmockits, setListOfsubscribedSubmockits] = useState([]);
  const navigate = useNavigate();
  const selectHandler = (value) =>{
    
    console.log(value)
    navigate("/m/" + value)
  }

  //checks the auth state 
  useEffect(() => {
    auth.onAuthStateChanged(currentuser => {
      if(currentuser){
  
        const currentUser = auth.currentUser;
        if(currentUser){
          getDoc(doc(db, 'users', currentUser.uid)).then(userdocSnap => { 
            
            setListOfsubscribedSubmockits([...userdocSnap.data().subcribedSubMockits])
      
          })
        }
       
      }
      else{
        console.log('user has logged out')
        setListOfsubscribedSubmockits(["movies", 'tvshows', 'videogames', 'politics', 'pics', 'zelda', 'mario'])
      }
    })


  },[])

  useEffect (() => {
  
    const currentUser = auth.currentUser;
    if(currentUser){
      getDoc(doc(db, 'users', currentUser.uid)).then(userdocSnap => { 
        
        setListOfsubscribedSubmockits([...userdocSnap.data().subcribedSubMockits])
  
      })
    }

  }, []);


   
    return (

      <div id="header" >
        
       <select className='headerSelect' value="My submockits" onChange={(e) => {selectHandler(e.target.value)}} id="subMockItsPullDown">
        <option  disabled>My submockits</option>
        {listOfsubscribedSubmockits.map((subMockit) => {
                  return (
                     
                   <option key={"subName" + subMockit}>{subMockit}</option>
                    // <Link  key={"subName" + subMockit}to={"/m/" + subMockit } className="headerItem" >{subMockit}</Link>
                      )
                })} </select>|

       {/* <span className='headeritemContainer'> */}
       <div className='headeritemContainer'>{listOfsubscribedSubmockits.map((subMockit) => {
                  return (
                     
                   <Link  key={"subName" + subMockit}to={"/m/" + subMockit } className="headerItem" >{subMockit}</Link>
                    
                      )
                })}</div>
      {/* </span> */}

      {/* key={} */}
       
      </div>

    );
  }
  
  export default Header;