import { useParams } from 'react-router-dom';
import MockItMenu from './/mockItMenu.js'
import SubMockitThread from './Threads.js';
import { db, auth } from '../firebase/firebase-config'
import CommentTemplate from './commentTemplate.js';
import { onSnapshot, collection, useCollectionData, getDocs, getDoc, setDoc, doc, exists, addDoc } from 'firebase/firestore'
import '../style/comments.css';
import { useEffect, useState } from 'react';

function ReplyForm(props) {



    return (
   
<div>reply form</div>

    );
  }
  
  
  export default ReplyForm;