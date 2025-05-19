'use client'

import { useEffect, useState } from 'react';
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
  // const user = crendentialModel.getUser()
  const [filters, setFilter] = useState({
    page: 0,
    count: 4,
    search: '',
    isDeleted: false,
    status: ''
  })
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loaging, setLoader] = useState(true)

  const getData = (p = {}) => {
    setLoader(true)
    let filter = { ...filters, ...p }
    let url = 'blog/all'
    ApiClient.get(url, filter).then((res) => {
      if (res) {
        console.log(res) 
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
    getData(
      { page: 1 }
    )
  }, [])

  const routeBlogDetail =(id)=>{
    router.push(`blogdetail/${id}`)
  }

  const reset = () => {
    let filter = {
      status: '',
      // role:'',
      search: '',
      page: 1,
    }
    setFilter({ ...filters, ...filter })
    getData({ ...filter })
  }

  //Url for Video
  const noVideo = (video, modal = 'blogs') => {
      console.log(video, "Video Path Check");
      
      // Default video path
      let value = '/assets/video/default.mp4'; 
  
      // Check if video is provided, and ensure the path is constructed correctly
      if (video) {
          // Assuming the video path is already in the correct format like 'blogs/e3e0b44e-4179-4691-a635-11b699d8cbeb1747304034768.mp4'
          value = `${'https://api.upfilly.com/'}/${modal}/${video}`; 
      }
  
      return value;
  }

  return (
    <>
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
      <div className='blogs-sect'>
      <div class="container  ">
        <div className='d-flex align-items-center justify-content-between mb-4'>
        <h3 className='blog_title mb-0' >Blogs</h3>
          <div class="form-group mb-0">
                {/* <i class="fa fa-search form-control-feedback"></i> */}
                <input type="search" className="form-control roundedInput"   placeholder="Search" value={filters?.search}  onChange={e => filter({ search: e.target.value, page: 1 })} />
                {filters?.search ? <>
                  {/* <a className="btn btn-primary ml-2" onClick={e => reset()}>
                    Reset
                  </a> */}
                </> : <></>}
              </div>
        </div>
          <div class="row">
        
           
            {!loaging && data?.data?.map((itm) =>
              // eslint-disable-next-line react/jsx-key
              <div class="col-12 col-md-6 col-lg-4 mb-4" >
                <div class="card card-shadow blog_cards">
                  <Carousel showIndicators={false}>
                    {itm?.videos?.length > 0 ? (
          itm.videos.map((videoUrl, index) => (
            <div key={index}>
              <div className="card-img-overlay" onClick={() => routeBlogDetail(itm?.slug)}>
                <a className="cantain_btns">{itm.category_name}</a>
              </div>
              <div className="blog_cardd">
                <video className="blog_video" controls autoPlay>
                  <source src={noVideo(videoUrl, 'blogs')} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ))
        ) : itm?.image?.length > 0 ? (
                      itm.image.map((images) => (
                        <div key={images.id}>
                          <div class="card-img-overlay" onClick={()=>routeBlogDetail(itm?.slug)}>
                            <a class="cantain_btns">{itm.category_name}</a>
                          </div>
                          <div className='blog_cardd'  >
                            <img className='blog_img' src={methodModel.userImg(images)} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>
                        <div class="card-img-overlay" onClick={()=>routeBlogDetail(itm?.slug)}>
                          <a class="cantain_btns" >{itm.category_name}</a>
                        </div>
                        <div className='blog_cardd' >
                          <img className='blog_img' src="/assets/img/noimage.jpg" alt="Static Image" />
                        </div>
                      </div>
                    )}
                  </Carousel>

                  <div class="card-body" >

                 
                  <div>
                  <div className='flex'>
                  {/* Initailly Link appended to text */}
                  <h4 className="card-title" >
                  <a href={itm.link} target="_blank" rel="noopener noreferrer">
                    {methodModel.capitalizeFirstLetter(itm?.title)}
                  </a>
                </h4></div>
                  
                    <p class="card-text   text-truncate" dangerouslySetInnerHTML={{
                      __html: itm?.description && itm.description.length > 40
                        ? itm.description.slice(0, 40) + '...' : itm?.description
                    }} />
                    </div>

                   

                   
                  </div>
                  <div class="card-footer text-muted d-flex justify-content-between align-items-center  bg-transparent border-top-0 read-more-btn">
                  <div class="views text-end"> <i class="fa fa-clock-o mr-2 " aria-hidden="true"></i>
                  {datepipeModel.date(itm?.createdAt)}
                    </div>
                  <Link href={`blogdetail/${itm?.slug}`} class="btn btn-primary ">Read More</Link>
                   
                  </div>
                </div>
              </div>)}
          </div>
          {!loaging && total == 0 ? 
          
        <div className='no_datashow d-flex justify-content-center align-items-center flex-column'>
        <img src='/assets/img/no_data.jpg' className='no_data_im' />
<div className="py-1 text-center">No Data</div> 
        </div>: <></>}

          <div className={`paginationWrapper ${!loaging && total > filters?.count ? '' : 'd-none'}`}>
            <span>Show {filters?.count} from {total} Users</span>
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

          {loaging ? <div className="text-center py-4">
            <img src="/assets/img/loader.gif" className="pageLoader" />
          </div> : <></>}
        </div>
      </div>
      
       
        </Layout>
    </>
  );
}
