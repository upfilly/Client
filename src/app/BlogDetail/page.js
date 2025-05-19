"use client";

import { useEffect, useState } from "react";
import "./style.scss";
import { useParams, useRouter } from "next/navigation";
import { Carousel } from "react-responsive-carousel";
import ApiClient from "@/methods/api/apiClient";
import methodModel from "@/methods/methods";
import Layout from "../components/global/layout";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import loader from "../../methods/loader";

export default function BlogDetail({ params }) {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoader] = useState(true);

  const getData = (p = {}) => {
    loader(true);
    let url = "blog";
    ApiClient.get(url, { id: params.id }).then((res) => {
      if (res) {
        setData(res?.data);
        setTotal(res?.data?.total);
      }
      loader(false);
    });
  };

  useEffect(() => {
    getData();
  }, [params.id]);

  return (
    <>
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
          <>
           <section className="blog_section" >
           <div class="container">
              <div className="row">
              <div class="col-md-12 ">
                <div className="blog_cols">
                
                  <a className="overflowTitle" href="/Blog">
                    <i class="fa fa-arrow-left" aria-hidden="true"></i>
                  </a>
                  <h3 className="overflowTitle">
                    {methodModel.capitalizeFirstLetter(data?.title)}
                  </h3>
                  <Carousel showIndicators={false} className="blog_bg banner_blogs">
                    {data?.image ? (
                      data.image.map((images) => (
                        <>
                          <div class="card-img-overlay">
                            <a href="#" class="btn btn-light btn-sm">
                              {data?.blog_type_id?.name}
                            </a>
                          </div>
                          <div className="blog_banners"  key={images.id}>
                            <img className="image_blogs" src={methodModel.userImg(images)} />
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
            </div>
           <div className="blog-padding">
           <div className="container">
              <div className="row">
                <div class="col-12 col-sm-12  col-md-8 mb-4">
                <div className="blogs-inner">
                <h3 className="blog_title" >{methodModel.capitalizeFirstLetter(data?.sub_title)}</h3>
                  <h5 className=" blog_title_inner ">{data?.meta_title}</h5>
                  <p
                    className="blog_paragraph"
                    dangerouslySetInnerHTML={{ __html: data?.description }}
                  />
                </div>
                </div>
                <div className="col-12 col-sm-12  col-md-4 mb-4">
                  <div className="categories">
                    <h3 className="categories_titles">Categories</h3>
                    <ul className="categories-inner">
                      <li className="cate_lists" >Best Blogs</li>
                      <li className="cate_lists" >Best</li>
                      <li className="cate_lists" >Blogs</li>
                      <li className="cate_lists" >Best Blogs</li>
                      <li className="cate_lists" >Best Blogs</li>
                      <li className="cate_lists" >Best Blogs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
           </div>
           </section>
          </>

    
      </Layout>
    </>
  );
}
