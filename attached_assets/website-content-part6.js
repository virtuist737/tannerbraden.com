// src/content/recommendations.js (continued)
export const appsAndServices = {
  apps: [
    {
      name: "Waking Up",
      description: "A life-changing app that has helped me understand the true nature of my mind through mindfulness meditation."
    },
    {
      name: "YNAB",
      description: "The app and method we use for managing our family's finances / budget."
    },
    {
      name: "Todoist",
      description: "My favorite app for task / project management (personal & work)."
    },
    {
      name: "Spark",
      description: "Fantastic app for email."
    },
    {
      name: "forScore",
      description: "I've digitized my entire sheet music library and added them into this app. It's fantastic."
    },
    {
      name: "Amazing Slow Downer",
      description: "Great app for slowing songs down as you try to figure them out and learn them."
    },
    {
      name: "Vanguard",
      description: "My choice for stock & bond investments."
    },
    {
      name: "Mealime",
      description: "Our favorite app for managing recipes, grocery lists and meal plans."
    },
    {
      name: "Marco Polo",
      description: "My favorite app for staying in touch with friends and family."
    },
    {
      name: "Goodreads",
      description: "Makes it super convenient to track books I've read and want to read."
    }
  ],
  financialServices: [
    {
      name: "Chase Freedom Unlimited",
      description: "Our main credit card, 1.5% cash back on everything."
    },
    {
      name: "Amazon Prime Rewards Visa",
      description: "5% cash back on all Amazon.com orders."
    }
  ]
};

export const music = {
  artists: [
    "Ed Sheeran",
    "Eric Whitacre",
    "A Great Big World",
    "Guster",
    "Jeremy Passion",
    "John Mayer",
    "Kygo",
    "Michael Bublé",
    "Josh Groban",
    "Mikel & GameChops",
    "ODESZA",
    "Pentatonix",
    "Stevie Wonder",
    "Relient K",
    "Sugar Ray",
    "Switchfoot",
    "twenty one pilots",
    "Us the Duo",
    "Yo Yo Ma",
    "Young the Giant"
  ]
};

export const podcasts = {
  recommendations: [
    "Lex Fridman Podcast",
    "The Huberman Lab Podcast"
  ]
};

// src/content/hobbies.js
export const hobbies = {
  categories: [
    {
      name: "Learning",
      interests: [
        "Español",
        "Coding"
      ]
    },
    {
      name: "Musical Instruments",
      instruments: [
        "Piano",
        "Guitar",
        "Ukulele"
      ]
    },
    {
      name: "Sports",
      activities: [
        "Cycling",
        "Hiking",
        "Tennis"
      ]
    },
    {
      name: "Media",
      interests: [
        "Books",
        "Podcasts"
      ]
    }
  ]
};

// src/components/Layout.js
import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-100 border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Tanner Braden</h1>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 flex gap-8">
        <aside className="w-64 flex-shrink-0">
          <Navigation />
        </aside>
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
