import methodModel from "@/methods/methods";
import environment from "../../../environment"
import BlogDetail from "../page"

export async function generateMetadata({ params }) {
  const res = await fetch(`${environment.api}blog?slug=${params.id}`);
  const blog = await res.json();
  const blogData = await blog.data;

  console.log(blogData,"ooooooo")
  
  return {
    title: blogData?.title ? methodModel.capitalizeFirstLetter(blogData.title) : 'Blog Post',
    description: blogData?.meta_description || 
                blogData?.description?.substring(0, 160) || 
                'Interesting blog post',
    openGraph: {
      title: blogData?.title ? methodModel.capitalizeFirstLetter(blogData.title) : 'Blog Post',
      description: blogData?.meta_description || 
                 blogData?.description?.substring(0, 160) || 
                 'Interesting blog post',
      images: blogData?.image?.length > 0 
        ? blogData.image.map(img => ({ 
            url: methodModel.userImg(img),
            width: 800,
            height: 600,
            alt: blogData.title 
          }))
        : [{ url: '/assets/img/noimage.jpg' }],
      type: 'article',
    },
  };
}

export default function Page({ params }) {
  return <BlogDetail params={params} />;
}