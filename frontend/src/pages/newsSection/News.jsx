import { Link } from "react-router-dom";
import "./News.css";
import axios from 'axios'
import React from 'react'
import NewsList from "./NewsList";

export default function Navbar({ username = "User" }) {
  const [query,setQuery] =React.useState('');
  const [loading,setLoading] =React.useState(true);
  const [error,setError]=React.useState('');
  const [news,setNews]=React.useState([]);
  const handleChange=(e)=>{
    setQuery(e.target.value);
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!query) {
      setError("Enter Something to get News....");
    return ;
        }
        try{
          console.log("Request Sent...")
          const response=await axios.get('https://ai-stock-analyser-9o13.onrender.com/analyze/news',
            {
              params:{
                query:query
              }
            })
            console.log("Response received");
            if(response.status==200){
              setNews(response.data.news);
              console.log("News Added to Array:", news);
            }
            else{
              setError(response.error);
              console.log(response.error)
            }
        }
        catch(err){
          setError("Internal Server Error");
          console.log(err);
        }
     }
  return (
    <>
    <div className="conatiner d-flex justify-content-center">
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top custom-navbar">
      <div className="container">
        <Link to="/home" className="navbar-brand d-flex align-items-center">
          <img
            src="/images/logo.jpeg"
            alt="AI Stock Analyzer Logo"
            width="40"
            height="40"
            className="me-2 rounded"
          />
          <span className="fw-bold fs-4">AI Stock Analyzer</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links + Profile */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link to="/home" className="nav-link">Home</Link>
            </li>

            <li className="nav-item">
              <Link to="/news" className="nav-link">Get Today's News</Link>
            </li>

            <li className="nav-item">
              <Link to="/analyze" className="nav-link">Analyse Stock</Link>
            </li>

           
          </ul>
        </div>
      </div>
    </nav>
    
      <div className="mt-3 d-flex flex-column align-items-center" style={{maxWidth:'1000px'}}>
        <h6 style={{fontSize:'20px',fontFamily:'sans-serif'}} className="text-dark mb-3 text-center">Search and Get Amazed with Results .... Get the Most Popular News</h6>
       <div className="input-group mt-3" style={{maxWidth:'560px',width:'100%'}}>
        <input 
            type="text"
            placeholder="Enter the  Stock to get News"
            className="form-control "
            onChange={handleChange}
          />
          {error && <small className="text-danger">{error}</small> }
         <button
          className="btn btn-dark"
          onClick={handleSubmit}
           >
          🔍
        </button>
       </div>
       
      </div>
      
    </div>
      <NewsList news={news}/>
    </>
  );
}
