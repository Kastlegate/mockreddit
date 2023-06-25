import Header from './components/header.js'
import UserNavBar from './components/userNavBar.js'
import Home from './components/home.js'
import SubMockit from './components/subMockit.js'
import Comments from './components/comments.js'
import User from './components/user.js'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';


function App() {


  return (
    <div id="app">
    <Router>

      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route path="/m/:subMockit" element={<SubMockit />}></Route>
        <Route path="/m/:subMockit/:thread/comments" element={<Comments />}></Route>
        <Route path="/u/:user" element={<User />}></Route>
      </Routes>
    </Router>    
    </div>
  );
}

export default App;
