import React from 'react'
import NewsCard from './NewsCard';

const NewsList = ({news}) => {
  return (
    <div  className='container mt-4'>
        <div className="row g-4">
            {
            news.map((newsEle,i)=>(
                <>
                <div className='col-md-4' key={i}>
                    <NewsCard newsEle={newsEle}/>
                </div>
                </>
            ))
        }
        </div>
    </div>
  )
}

export default NewsList