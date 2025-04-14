import { Helmet } from 'react-helmet-async';

// ... rest of the file (assuming other components and imports exist) ...

function Projects() {
  // ... other code for the Projects component ...

  return (
    <>
      <Helmet>
        <title>Projects - Tanner Braden | Digital Creator & Audio Designer</title>
        <meta
          name="description"
          content="Discover Tanner Braden's innovative digital creations, audio design projects, and interactive web applications focused on enhancing human consciousness and fostering mindfulness in the digital age."
        />
        <meta
          name="keywords"
          content="digital creator portfolio, audio design projects, web applications, interactive experiences, consciousness technology, creative development, music production tools, mindfulness innovations"
        />
        <meta property="og:title" content="Projects - Tanner Braden | Digital Creator & Audio Designer" />
        <meta
          property="og:description"
          content="Discover Tanner Braden's innovative digital creations, audio design projects, and interactive web applications focused on enhancing human consciousness and fostering mindfulness in the digital age."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="https://res.cloudinary.com/dvk20sglr/image/upload/v1739851169/tanner2.0_dark-500x500_f0dznv.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Projects - Tanner Braden | Digital Creator & Audio Designer" />
        <meta
          name="twitter:description"
          content="Discover Tanner Braden's innovative digital creations, audio design projects, and interactive web applications focused on enhancing human consciousness and fostering mindfulness in the digital age."
        />
        <meta name="twitter:image" content="https://res.cloudinary.com/dvk20sglr/image/upload/v1739851169/tanner2.0_dark-500x500_f0dznv.png" />
      </Helmet>
      {/* ... rest of the Projects component's JSX ... */}
    </>
  );
}

// ... rest of the file (assuming other components and exports exist) ...