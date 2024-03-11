"use client";

import { useEffect, useState } from "react";
import "./style.scss";
import { useParams, useRouter } from "next/navigation";
import { Carousel } from "react-responsive-carousel";
import ApiClient from "@/methods/api/apiClient";
import methodModel from "@/methods/methods";
import Layout from "../../components/global/layout";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import loader from "../../../methods/loader";

export default function BlogDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loaging, setLoader] = useState(true);

  const getData = (p = {}) => {
    loader(true);
    let url = "blog";
    ApiClient.get(url, { id: id }).then((res) => {
      if (res) {
        setData(res?.data);
        setTotal(res?.data?.total);
      }
      loader(false);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
          <>
            <div class="container-fluid p-0">
              <div className="row">
                <div class="col-md-12 mx-auto p-0">
                  <a className="overflowTitle" href="/Blog">
                    <i class="fa fa-arrow-left" aria-hidden="true"></i>
                  </a>
                  <h3 className="overflowTitle">
                    {methodModel.capitalizeFirstLetter(data?.title)}
                  </h3>
                  <Carousel showIndicators={false} className="blog_bg">
                    {data?.image ? (
                      data.image.map((images) => (
                        <>
                          <div class="card-img-overlay">
                            <a href="#" class="btn btn-light btn-sm">
                              {data?.blog_type_id?.name}
                            </a>
                          </div>
                          <div key={images.id}>
                            <img src={methodModel.userImg(images)} />
                          </div>
                        </>
                      ))
                    ) : (
                       <div>
                        <img src="/assets/img/noimage.jpg" alt="Static Image" />
                      </div>
                    )}
                  </Carousel>
                </div>
              </div>
            </div>
           <div className="blog-padding">
           <div className="container">
              <div className="row">
                <div class="col-md-9">
                <div className="blogs-inner">
                <h3>{methodModel.capitalizeFirstLetter(data?.sub_title)}</h3>
                  <h5 className="title">{data?.meta_title}</h5>
                  <p
                    className="paragraph"
                    dangerouslySetInnerHTML={{ __html: data?.description }}
                  />
                </div>
                </div>
                <div className="col-md-3">
                  <div className="categories">
                    <h3 className="">Categories</h3>
                    <div className="categories-inner">
                      <span>Best Blogs</span>
                      <span>Best</span>
                      <span>Blogs</span>
                      <span>Best Blogs</span>
                      <span>Best Blogs</span>
                      <span>Best Blogs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           </div>
          </>

        {/* {loaging ? (
          <div className="text-center py-4">
            <img src="/assets/img/loader.gif" className="pageLoader" />
          </div>
        ) : (
          <></>
        )} */}
      </Layout>
    </>
  );
}
