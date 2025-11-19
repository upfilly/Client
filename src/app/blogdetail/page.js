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
  const [data, setData] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoader] = useState(true);

  const getData = () => {
    loader(true);
    ApiClient.get("blog", { slug: params.id }).then((res) => {
      if (res) {
        const media = [
          ...(res?.data?.image || []).map((item) => ({
            type: "image",
            url: item,
          })),
          ...(res?.data?.videos || []).map((item) => ({
            type: "video",
            url: item,
          })),
        ];
        setData({ ...res?.data, media });
        setTotal(res?.data?.total);
      }
      loader(false);
    });
  };

  const handleVideoError = (e) => {
    const video = e.target;
    const error = video?.error;

    if (error) {
      console.error("Video Error Code:", error.code);
      console.error("Video source URL:", video.currentSrc);
    }
  };

  useEffect(() => {
    getData();
  }, [params.id]);

  return (
    <Layout
      handleKeyPress={undefined}
      setFilter={undefined}
      reset={undefined}
      filter={undefined}
      name={undefined}
      filters={undefined}
    >
      <section className="blog_section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="blog_cols">
                <a className="overflowTitle" href="/blog">
                  <i className="fa fa-arrow-left" aria-hidden="true"></i>
                </a>
                <h3 className="overflowTitle">
                  {methodModel.capitalizeFirstLetter(data?.title)}
                </h3>
                <Carousel
                  showIndicators={false}
                  swipeable={false}
                  emulateTouch={false}
                  className="blog_bg banner_blogs"
                >
                  {data?.media?.length > 0 ? (
                    data.media.map((item, index) => (
                      <div key={index} className="blog_banners">
                        <div
                          className="card-img-overlay"
                          style={{ pointerEvents: "none" }}
                        >
                          <a
                            href="#"
                            className="btn btn-light btn-sm"
                            style={{ pointerEvents: "auto" }}
                          >
                            {data?.blog_type_id?.name}
                          </a>
                        </div>
                        {item.type === "image" ? (
                          <img
                            className="image_blogs"
                            src={methodModel.userImg(item.url)}
                            alt="Blog Image"
                          />
                        ) : (
                          <video
                            className="image_blogs video_blogs"
                            style={{ zIndex: 1, position: "relative" }}
                            controls
                            onError={handleVideoError}
                            crossOrigin="anonymous"
                          >
                            <source
                              src={`https://api.upfilly.com/blogs/${item?.url}`}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
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
              <div className="col-12 col-sm-12 col-md-8 mb-4">
                <div className="blogs-inner">
                  <h3 className="blog_title">
                    {methodModel.capitalizeFirstLetter(data?.sub_title)}
                  </h3>
                  <h5 className="blog_title_inner">{data?.meta_title}</h5>
                  <p
                    className="blog_paragraph"
                    dangerouslySetInnerHTML={{
                      __html: data?.description,
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-4 mb-4">
                <div className="categories">
                  <h3 className="categories_titles">Categories</h3>
                  <ul className="categories-inner">
                    <li className="cate_lists">Best Blogs</li>
                    <li className="cate_lists">Best</li>
                    <li className="cate_lists">Blogs</li>
                    <li className="cate_lists">Best Blogs</li>
                    <li className="cate_lists">Best Blogs</li>
                    <li className="cate_lists">Best Blogs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
