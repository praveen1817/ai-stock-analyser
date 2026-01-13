import React from 'react'

const NewsCard = ({newsEle}) => {
  return (
    <div className='card h-100 shadow-sm'>
        {
            newsEle && 
            <img
              src={newsEle.imageUrl}
              alt={newsEle.title}
              className='card-img-top'
              style={{height:'180px',objectFit:'cover'}}
            />
        }
        <div className="card-body mt-2 d-flex flex-column">
            <h6 className='card-title'>
                {newsEle.title}
            </h6>
            <p className="card-text text-muted">
                {newsEle.description}
            </p>
            <div className='mt-auto'>
                <a
                href={newsEle.url}
                className='btn btn-outline-primary bt-sm'
                target='_blank'
                rel="noopener noreferrer"
                >
                    Read Full News
                </a>
            </div>
        </div>

    </div>
  )
}

export default NewsCard;