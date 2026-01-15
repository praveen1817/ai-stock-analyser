import React from 'react'
import { Link} from 'react-router-dom';
import axios from 'axios'

const Analyse = () => {
  const [userQuestion,setUserQuestion]=React.useState({
    query:'',
    prompt:''
  });
  const [responseData,setResponseData]=React.useState({});
  const [profile,setProfile]=React.useState({});
  const [analytics,setAnalytics]=React.useState({});
  const [errors,setErrors] =React.useState('');
  const [answer,setAnswer]=React.useState({});

  const handleChange=(e)=>{
    setUserQuestion({...userQuestion,[e.target.name]:e.target.value})
    console.log(e.target.value);
  }
  function formatKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")   // add space before capital letters
    .replace(/^./, str => str.toUpperCase());
}

  const handleSubmit= async(e)=>{
    e.preventDefault();
    if(!userQuestion) {
      setErrors("Please Choose the Symbhol");
      return null;
    }
    try{
      const response=await axios.post("https://ai-stock-analyser-9o13.onrender.com/analyze/analyze-stock",userQuestion);
      if(response.status==200){
        setResponseData(response.data.parsedAnswer);
        console.log(response.data);
        setProfile(response.data.parsedAnswer["Companies Profile"]);
        console.log(response.data.parsedAnswer["Companies Profile"]);
        setAnalytics(response.data.parsedAnswer.Analytics);
        setAnswer(response.data.parsedAnswer.Answer);
      }
      if(!responseData){
        setErrors("Some Internal Server Error Occured")
      }

    }catch(err){
      setErrors(err);
      console.log(err);
    }
    
  }

  return (
    <>
<div className="container-fluid mt-0">
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

            <li className="nav-item dropdown">
              

              
            </li>
          </ul>
        </div>
      </div>
    </nav>

  <div className="row mb-4 mt-4">
    <div className="row d-flex flex-row mb-4">
  <div className="col-md-6">

    {/* Stock Selector */}
    <label className="form-label fw-semibold">Select Stock</label>
    <div className="d-flex gap-2 mb-3">
      <select
        className="form-select"
        onChange={handleChange}
        name='query'
      >
        <option value="">Select Stock</option>
        <option value="SBIN.NS">State Bank of India</option>
        <option value="HDFCBANK.NS">HDFC Bank</option>
        <option value="RELIANCE.NS">Reliance</option>
        <option value="TATAMOTORS.NS">Tata Motors</option>
        <option value="TCS.NS">Tata Consultancy</option>

      </select>

      <button
        className="btn btn-primary"
        onClick={handleSubmit}
      >
        🔍
      </button>
    </div>

    {/* Question Input */}
    <label className="form-label fw-semibold">
      Ask a question about the selected stock
    </label>
    <input
      type="text"
      className="form-control"
      placeholder="Example: Is this a good long-term investment?"
      name='prompt'
      onChange={handleChange}
      value={userQuestion.prompt}
    />

    <small className="text-muted">
      Select a stock first, then ask your question.
    </small>
     {errors && <small className='text-danger'>{errors}</small>}
  </div>
  <div className="col-md-6">
      <div className="list-group shadow-sm">
        <button className="list-group-item list-group-item-action active">
          Company Profile
        </button>
        <button className="list-group-item list-group-item-action">
          Analytics
        </button>
        <button className="list-group-item list-group-item-action">
          AI Answer
        </button>
      </div>
    </div>

</div>

  </div>

  <div className="row">

    {/* Sidebar */}
    

    {/* Content Area */}
    <div className="col-md-9">

      {/* Company Profile Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">
          Company Profile
        </div>
        <div className="card-body">
              {profile && Object.entries(profile).map(([key, value]) => (
              <p key={key}>
                <strong>
                  {formatKey(key)}:
                </strong>{" "}
                {typeof value === "number"
                  ? value.toLocaleString()
                  : value}
              </p>
            ))}
        </div>
      </div>

      {/* Analytics Card */}
      <div className="card shadow-sm mb-4">
  <div className="card-header fw-bold">
    Analytics
  </div>

  <div className="card-body">
    {analytics &&
      Object.entries(analytics).map(([key, value]) => {

        // ✅ If value is an object (Trend / Interpretation)
        if (typeof value === "object" && value !== null) {
          return (
            <div key={key} className="mb-3">
              <p className="fw-bold mb-1">{formatKey(key)}:</p>

              <ul className="mb-0">
                {Object.entries(value).map(([subKey, subValue]) => (
                  <li key={subKey}>
                    <strong>{formatKey(subKey)}:</strong>{" "}
                    {typeof subValue === "number"
                      ? subValue.toFixed(4)
                      : subValue}
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        // ✅ Normal key-value
        return (
          <p key={key}>
            <strong>{formatKey(key)}:</strong>{" "}
            {typeof value === "number" ? value : value}
          </p>
        );
      })}
  </div>
</div>


      {/* AI Answer Card */}
      <div className="card shadow-sm border-primary">
        <div className="card-header fw-bold bg-primary text-white">
          AI Recommendation
        </div>
        <div className="card-body">
                  {answer &&
                Object.entries(answer).map(([key, value]) => {

                  // ✅ If value is an object (Trend / Interpretation)
                  if (typeof value === "object" && value !== null) {
                    return (
                      <div key={key} className="mb-3">
                        <p className="fw-bold mb-1">{formatKey(key)}:</p>

                        <ul className="mb-0">
                          {Object.entries(value).map(([subKey, subValue]) => (
                            <li key={subKey}>
                              <strong>{formatKey(subKey)}:</strong>{" "}
                              {typeof subValue === "number"
                                ? subValue.toFixed(4)
                                : subValue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }

                  return (
                            <p key={key}>
                <strong>{formatKey(key)}:</strong>{" "}
                {typeof value === "boolean"
                  ? value ? <p className='text-success'>✅Good Time to Buy </p>:
                  <p className='text-danger'>❌Make Decisons With Your Own Risks</p>
                  : value}
                            </p>
                  );
                })}
        </div>
      </div>

    </div>
  </div>
</div>
    </>
  )
}

export default Analyse;