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
    ApiClient.get(url, filter).then(res => {
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
    getData(
      { page: 1 }
    )
  }, [])

  const routeBlogDetail =(id)=>{
    router.push(`BlogDetail/${id}`)
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

  return (
    <>
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
        <div class="container  blogs-sect">
          <div class="row">
          <h1>Blogs</h1>
            <div className='col-md-12 text-right'>
              <div class="form-group has-search position-relative w-25 ml-auto">
                {/* <i class="fa fa-search form-control-feedback"></i> */}
                <input type="search" className="form-control roundedInput"   placeholder="Search" value={filters?.search}  onChange={e => filter({ search: e.target.value, page: 1 })} />
                {filters?.search ? <>
                  {/* <a className="btn btn-primary ml-2" onClick={e => reset()}>
                    Reset
                  </a> */}
                </> : <></>}
              </div>
            </div>
            {!loaging && data?.data?.map((itm) =>
              // eslint-disable-next-line react/jsx-key
              <div class="col-12 col-sm-8 col-md-6 col-lg-4 mb-4" >
                <div class="card card-shadow">
                  <Carousel showIndicators={false}>
                    {itm?.image?.length > 0 ? (
                      itm.image.map((images) => (
                        <div key={images.id}>
                          <div class="card-img-overlay" onClick={()=>routeBlogDetail(itm?.id)}>
                            <a class="btn btn-light btn-sm">{itm.category_name}</a>
                          </div>
                          <div>
                            <img className='blog_img' src={methodModel.userImg(images)} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>
                        <div class="card-img-overlay" onClick={()=>routeBlogDetail(itm?.id)}>
                          <a class="btn btn-light btn-sm" >{itm.category_name}</a>
                        </div>
                        <div>
                          <img className='blog_img' src="/assets/img/noimage.jpg" alt="Static Image" />
                        </div>
                      </div>
                    )}
                  </Carousel>

                  <div class="card-body" onClick={()=>routeBlogDetail(itm?.id)}>

                 
                  <div>
                  <h4 class="card-title">{methodModel.capitalizeFirstLetter(itm?.title)}</h4>
                    <p class="card-text   text-truncate" dangerouslySetInnerHTML={{
                      __html: itm?.description && itm.description.length > 40
                        ? itm.description.slice(0, 40) + '...' : itm?.description
                    }} />
                    </div>

                   

                   
                  </div>
                  <div class="card-footer text-muted d-flex justify-content-between align-items-center  bg-transparent border-top-0 read-more-btn">
                  <div class="views text-end">{datepipeModel.date(itm?.createdAt)}
                    </div>
                  <Link href={`BlogDetail/${itm?.id}`} class="btn btn-primary ">Read More</Link>
                   
                  </div>
                </div>
              </div>)}
          </div>
          {!loaging && total == 0 ? <div className="py-3 text-center">No Data</div> : <></>}

          <div className={`paginationWrapper ${!loaging && total > filters?.count ? '' : 'd-none'}`}>
            <span>Show {filters?.count} from {total} Users</span>
            <ReactPaginate
              breakLabel="..."
              nextLabel="Next >"
              initialPage={filters?.page}
              onPageChange={pageChange}
              pageRangeDisplayed={6}
              className="pagination-item"
             // pageCount={Math.ceil(total / filters?.count)}
          pageCount={3}
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
        </Layout>
    </>
  );
}
