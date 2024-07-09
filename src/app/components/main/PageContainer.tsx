import environment from '@/environment';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Script from 'next/script';
import { Helmet, HelmetProvider } from 'react-helmet-async';
type Props = {
  description?: string;
  children: any;
  title?: string;
  settingData:any
};

const PageContainer = ({ title, description, children ,settingData}: Props) => (
  <>      
    <HelmetProvider>
      <div>
        <Helmet>
          <title>{settingData?.company_name}</title>
          <link rel="icon" href={`${environment?.api}${settingData?.fav_icon}`} />
          <meta name="description" content={description} />
          <link rel="apple-touch-icon" href="%PUBLIC_URL%/favicon.ico" />
          <link href="https://fonts.googleapis.com/css2?family=Abel&family=Inter&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;1,200;1,300;1,400;1,500;1,600&display=swap" rel="stylesheet" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
            rel="stylesheet" />
          <link rel="stylesheet" href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' />
          {/* <link rel="stylesheet" href="/assets/fontawesome/css/all.css" /> */}
          <link rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossOrigin="anonymous" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossOrigin="anonymous" />
          <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossOrigin="anonymous"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.min.js" integrity="sha384-Rx+T1VzGupg4BHQYs2gCW9It+akI2MM/mndMCy36UVfodzcJcF0GGLxZIzObiEfa" crossOrigin="anonymous"></script>
          <script src="https://editor.unlayer.com/embed.js"></script>
        </Helmet>
        {/* <Script
          id="googlemaps"
          type="text/javascript"
          strategy="beforeInteractive"
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAID0kSQQmScLcv5PornXUOEG0LPn8hfKQ&libraries=places"
        /> */}
  
        {children}
        
      </div>
      <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCMRLNlhwKX08FU3cJhU3-Xa1oVZOam9xo&libraries=places" ></script>
    </HelmetProvider>
  </>
);

export default PageContainer;
