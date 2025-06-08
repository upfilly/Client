'use client'

import { useEffect, useState, useRef } from 'react';
import crendentialModel from '@/models/credential.model';
import "./style.scss";
import PageContainer from '../components/main/PageContainer'
import Header from '../components/global/header';
import { useRouter } from 'next/navigation'
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import methodModel from '@/methods/methods';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import datepipeModel from '@/models/datepipemodel';
import ReactPaginate from 'react-paginate';
import Footer from '../components/global/footer';
import Link from 'next/link';
import Layout from '../components/global/layout';

export default function Blog() {
  const router = useRouter()
  const [filters, setFilter] = useState({
    page: 0,
    count: 6,
    search: '',
    isDeleted: false,
    status: ''
  })
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoader] = useState(true)

  const getData = (p = {}) => {
    setLoader(true)
    let filter = { ...filters, ...p }
    let url = 'blog/all'
    ApiClient.get(url, filter).then((res) => {
      if (res) {
        setData(res?.data)
        setTotal(res?.data?.total_count)
      }
      setLoader(false)
    })
  }

  const pageChange = (e) => {
    setFilter({ ...filters, page: e.selected })
    getData({ page: e.selected + 1 })
  }

  const filter = (p = {}) => {
    setFilter({ ...filters, ...p, page: 0 })
    getData({ ...p, page: 1 })
  }

  useEffect(() => {
    getData({ page: 1 })
  }, [])

  const routeBlogDetail = (id) => {
    router.push(`blogdetail/${id}`)
  }

  const reset = () => {
    let filter = {
      status: '',
      search: '',
      page: 1,
    }
    setFilter({ ...filters, ...filter })
    getData({ ...filter })
  }

  const combineMediaItems = (itm) => {
    const mediaItems = [];
    
    // Add videos first if they exist
    if (itm?.videos?.length > 0) {
      itm.videos.forEach((videoUrl, index) => {
        mediaItems.push({
          type: 'video',
          url: `https://api.upfilly.com/blogs/${videoUrl}`,
          key: `video-${index}`
        });
      });
    }
    
    // Add images if they exist
    if (itm?.image?.length > 0) {
      itm.image.forEach((image, index) => {
        mediaItems.push({
          type: 'image',
          url: methodModel.userImg(image),
          key: `image-${index}`
        });
      });
    }
    
    // Add default image if no media exists
    if (mediaItems.length === 0) {
      mediaItems.push({
        type: 'image',
        url: '/assets/img/noimage.jpg',
        key: 'default-image'
      });
    }
    
    return mediaItems;
  }

  // Modified to make videos directly playable without using event handling
  const renderMediaItem = (item, itm) => {
    if (item.type === 'video') {
      return (
        <div key={item.key} className="media-item-wrapper">
          <div className="card-img-overlay">
            <span className="cantain_btns">{itm.category_name}</span>
          </div>
          <div className="media-container">
            <video
              className="blog-media"
              src={item.url}
              controls
              playsInline
              preload="metadata"
              onClick={(e) => {
                // Stop event propagation to prevent carousel from changing slides
                e.stopPropagation();
                
                // Only toggle play/pause when clicking on the video itself
                const video = e.target;
                if (video.paused) {
                  video.play().catch(err => console.error("Error playing video:", err));
                } else {
                  video.pause();
                }
              }}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div key={item.key} className="media-item-wrapper">
          <div className="card-img-overlay">
            <span className="cantain_btns">{itm.category_name}</span>
          </div>
          <div className="media-container">
            <img 
              className="blog-media" 
              src={item.url} 
              alt={itm.title || 'Blog content'} 
              loading="lazy"
            />
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
        <div className='blogs-sect'>
          <div className="container">
            <div className='d-flex align-items-center justify-content-between mb-4'>
              <h3 className='blog_title mb-0'>Blogs</h3>
              <div className="form-group mb-0">
                <input 
                  type="search" 
                  className="form-control roundedInput"   
                  placeholder="Search" 
                  value={filters?.search}  
                  onChange={e => filter({ search: e.target.value, page: 1 })} 
                />
                {filters?.search && (
                  <a className="btn btn-primary ml-2" onClick={reset}>
                    Reset
                  </a>
                )}
              </div>
            </div>
            <div className="row">
              {!loading && data?.data?.map((itm) => {
                const mediaItems = combineMediaItems(itm);
                return (
                  <div className="col-12 col-md-6 col-lg-4 mb-4" key={itm.id}>
                    <div className="card card-shadow blog_cards">
                      <Carousel
                        showIndicators={false}
                        showThumbs={false}
                        showStatus={false}
                        infiniteLoop
                        useKeyboardArrows
                        stopOnHover
                        swipeable
                        emulateTouch
                        preventMovementUntilSwipeScrollTolerance={true}
                        swipeScrollTolerance={50}
                        dynamicHeight={false}
                        renderArrowPrev={(onClickHandler, hasPrev, label) =>
                          hasPrev && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onClickHandler();
                              }}
                              title={label}
                              className="carousel-arrow carousel-arrow-left"
                            >
                              ❮
                            </button>
                          )
                        }
                        renderArrowNext={(onClickHandler, hasNext, label) =>
                          hasNext && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onClickHandler();
                              }}
                              title={label}
                              className="carousel-arrow carousel-arrow-right"
                            >
                              ❯
                            </button>
                          )
                        }
                        onChange={() => {
                          // Pause all videos when carousel slides change
                          document.querySelectorAll('video').forEach(video => {
                            video.pause();
                          });
                        }}
                      >
                        {mediaItems.map(item => renderMediaItem(item, itm))}
                      </Carousel>

                      <div className="card-body">
                        <div>
                          <div className='flex'>
                            <h4 className="card-title">
                              <a href={itm.link} target="_blank" rel="noopener noreferrer">
                                {methodModel.capitalizeFirstLetter(itm?.title)}
                              </a>
                            </h4>
                          </div>
                          <p 
                            className="card-text text-truncate" 
                            dangerouslySetInnerHTML={{
                              __html: itm?.description && itm.description.length > 40
                                ? itm.description.slice(0, 40) + '...' 
                                : itm?.description
                            }} 
                          />
                        </div>
                      </div>
                      <div className="card-footer text-muted d-flex justify-content-between align-items-center bg-transparent border-top-0 read-more-btn">
                        <div className="views text-end">
                          <i className="fa fa-clock-o mr-2" aria-hidden="true"></i>
                          {datepipeModel.date(itm?.createdAt)}
                        </div>
                        <Link href={`blogdetail/${itm?.slug}`} className="btn btn-primary">
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {!loading && total === 0 && (
              <div className='no_datashow d-flex justify-content-center align-items-center flex-column'>
                <img src='/assets/img/no_data.jpg' className='no_data_im' alt="No data" />
                <div className="py-1 text-center">No Data</div> 
              </div>
            )}

            <div className={`paginationWrapper ${!loading && total > filters?.count ? '' : 'd-none'}`}>
              <span>Show {filters?.count} from {total} Blogs</span>
              <ReactPaginate
                breakLabel="..."
                nextLabel="Next >"
                initialPage={filters?.page}
                onPageChange={pageChange}
                className="pagination-item"
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                pageCount={Math.ceil(total / filters?.count)}
                previousLabel="< Previous"
                renderOnZeroPageCount={null}
                pageClassName={"pagination-item"}
                activeClassName={"pagination-item-active"}
              />
            </div>

            {loading && (
              <div className="text-center py-4">
                <img src="/assets/img/loader.gif" className="pageLoader" alt="Loading..." />
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}