'use client'

import { useEffect, useState } from 'react';
import crendentialModel from '@/models/credential.model';
import "./style.scss";
import PageContainer from '../components/main/PageContainer'
import Header from '../components/global/header';
import { useRouter } from 'next/navigation'
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import ReactPaginate from 'react-paginate';
import Footer from '../components/global/footer';
import Layout from '../components/global/layout';

export default function Faq() {
  const router = useRouter()
  const [filters, setFilter] = useState({
    page: 0,
    count: 4,
    search: '',
    isDeleted: false,
  })
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loaging, setLoader] = useState(true)
  const [isOpen, setIsOpen] = useState({});
  
  const toggleQuestion = (index) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  let role = 'brand'
  const Login = () => {
    router.push('/signup/' + role)
  }

  const getData = (p = {}) => {
    setLoader(true)
    let filter = { ...filters, ...p }
    let url = 'faq/all'
    ApiClient.get(url, filter).then(res => {
      if (res) {
        const data = res?.data?.data?.filter(item => item.status === "active");
        setData(data)
        setTotal(res?.data?.total_count)
      }
      setLoader(false)
    })
  }

  const pageChange = (e) => {
    setFilter({ ...filters, page: e.selected })
    getData({ page: e.selected + 1 })
  }

  useEffect(() => {
    getData(
      { page: 1 }
    )
  }, [])

  return (
    <>
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
        <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <h1 class="display-4 font-weight-bold">FAQ</h1>
            {/* <p class="lead">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p> */}
          </div>
        </div>
        <br />
        <section id="faq" class="faq">
          <div class="container">
            <div class="faq-list">
              {/* {!loaging && data?.map((itm, index) => (
                <ul key={index}>
                  <li>
                    <i className="fa fa-question-circle icon-help" aria-hidden="true"></i>{" "}
                    <a
                      data-bs-toggle="collapse"
                      className="collapse"
                      data-bs-target={`#faq-list-${index}`}
                    >
                      {itm?.question}
                      <i className="fa fa-sm fa-angle-down icon-show" aria-hidden="true"></i>
                      <i className="fa fa-sm fa-angle-up icon-close"></i>
                    </a>
                    <div
                      id={`faq-list-${index}`}
                      className="collapse"
                      data-bs-parent=".faq-list"
                    >
                      <p dangerouslySetInnerHTML={{ __html: itm?.answer }} />
                    </div>
                  </li>
                </ul>
              ))} */}
              {
                !loaging &&
                data?.map((itm, index) => (
                  <ul key={index}>
                    <li>
                      <i className="fa fa-question-circle icon-help" aria-hidden="true"></i>{" "}
                      <a
                        data-bs-toggle="collapse"
                        className="collapse"
                        data-bs-target={`#faq-list-${index}`}
                        onClick={() => toggleQuestion(index)}
                      >
                        {itm?.question}
                        <i
                          className={isOpen[index] ? 'fa fa-sm fa-angle-up icon-close' : 'fa fa-sm fa-angle-down icon-show'}
                          aria-hidden="true"
                        ></i>
                         <i className="fa fa-sm fa-angle-up icon-close"></i>
                      </a>
                      <div
                        id={`faq-list-${index}`}
                        className={`collapse ${isOpen[index] ? 'show' : ''}`}
                        data-bs-parent=".faq-list"
                      >
                        <p dangerouslySetInnerHTML={{ __html: itm?.answer }} />
                      </div>
                    </li>
                  </ul>
                ))
              }
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
          pageCount={2}
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

        </section>
        </Layout>
    </>
  );
}
