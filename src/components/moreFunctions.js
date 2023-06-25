// get the dates from posts and gives how far back they were posted. Not accurate to 365 days
const getLengthOfTimeSincePosted = (postedDate) =>{
    const date = new Date(postedDate)
    const date2 = new Date();
    const seconds = (date2.getTime() - date.getTime()) / 1000;
    
    
    if(seconds < 60){
      const posted = Math.round(seconds) + " seconds " 
      return posted
    }
    else if(seconds >= 60 && seconds < 3600){
      const minutes = Math.round(seconds) / 60
      const posted = Math.round(minutes) + " minutes "
  
      return posted
    }
  
    else if(seconds >= 3600 && seconds < 86400){
      const hours = Math.round(seconds) / 3600
      const posted = Math.round(hours) + " hours "
  
      return posted
    }
  
    else if(seconds >= 86400 && seconds < 2592000){
      const days = Math.round(seconds) / 86400
      const posted = Math.round(days) + " days "
  
      return posted
    }
  
    else if(seconds >= 2592000 && seconds < 31104000){
      const months = Math.round(seconds) / 2592000
      const posted = Math.round(months) + " months "
  
      return posted
    }
  //  && seconds < 31104000
    else if(seconds >= 31104000){
      const years = Math.round(seconds) / 31104000
      const posted = Math.round(years) + " years "
  
      return posted
    }
  
  
  }

  const votesTotal = (upvotes, downvotes) => {
    let total = upvotes - downvotes;
    return total;
  }


  export {getLengthOfTimeSincePosted, votesTotal}