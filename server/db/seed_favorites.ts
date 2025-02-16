import { db } from "../db";
import { favorites } from "@shared/schema";

async function seedFavorites() {
  const favoriteData = [
    // Books
    {
      title: "Thinking, Fast and Slow",
      category: "Books",
      description: "Daniel Kahneman's exploration of the two systems that drive the way we think",
      link: "https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow",
      sortOrder: 1
    },
    {
      title: "The Innovator's Dilemma",
      category: "Books",
      description: "Clayton Christensen's influential work on disruptive innovation",
      link: "https://www.goodreads.com/book/show/2615.The_Innovator_s_Dilemma",
      sortOrder: 2
    },
    
    // Music
    {
      title: "Jazz Piano Essentials",
      category: "Music",
      description: "A curated collection of essential jazz piano pieces and techniques",
      link: "https://youtube.com/playlist?list=jazz-piano",
      sortOrder: 1
    },
    
    // Technology
    {
      title: "React",
      category: "Technology",
      description: "A JavaScript library for building user interfaces",
      link: "https://reactjs.org",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      sortOrder: 1
    },
    
    // Food
    {
      title: "Homemade Sourdough",
      category: "Food",
      description: "The art and science of making the perfect sourdough bread",
      sortOrder: 1
    },
    
    // Travel
    {
      title: "Kyoto, Japan",
      category: "Travel",
      description: "A perfect blend of traditional culture and modern innovation",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      sortOrder: 1
    }
  ];

  try {
    for (const data of favoriteData) {
      await db.insert(favorites).values(data);
    }
    console.log("Successfully seeded favorites table");
  } catch (error) {
    console.error("Error seeding favorites:", error);
  }
}

seedFavorites();
