import { Helmet } from 'react-helmet-async';

// ... rest of the file (assuming other components and imports exist) ...

function Projects() {
  // ... other code for the Projects component ...

  return (
    <>
      <Helmet>
        <title>Projects - Tanner Braden</title>
        <meta
          name="description"
          content="Explore applications, tools, and content designed to enhance human consciousness and foster personal growth and awareness."
        />
        <meta
          name="keywords"
          content="consciousness apps, mindfulness technology, digital wellbeing tools, human potential projects"
        />
        <meta property="og:title" content="Projects - Tanner Braden" />
        <meta
          property="og:description"
          content="Explore applications, tools, and content designed to enhance human consciousness."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:title" content="Projects - Tanner Braden" />
        <meta
          name="twitter:description"
          content="Explore applications, tools, and content designed to enhance human consciousness."
        />
      </Helmet>
      {/* ... rest of the Projects component's JSX ... */}
    </>
  );
}

// ... rest of the file (assuming other components and exports exist) ...