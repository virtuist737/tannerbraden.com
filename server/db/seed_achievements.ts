import { db } from "../db";
import { achievements } from "@shared/schema";

async function seedAchievements() {
  const achievementData = [
    // Exploration Achievements
    {
      title: "Explorer",
      description: "Visit all main sections of the website",
      icon: "🗺️",
      points: 100,
      requirements: "Visit Home, About, Blog, and Projects pages"
    },
    {
      title: "Blog Enthusiast",
      description: "Read 5 different blog posts",
      icon: "📚",
      points: 50,
      requirements: "Read 5 unique blog posts"
    },
    {
      title: "Project Inspector",
      description: "View details of 3 different projects",
      icon: "🔍",
      points: 75,
      requirements: "View 3 different project details"
    },
    
    // Interaction Achievements
    {
      title: "Social Butterfly",
      description: "Follow social media links",
      icon: "🦋",
      points: 25,
      requirements: "Click on social media links"
    },
    {
      title: "Engaged Reader",
      description: "Spend 5 minutes reading a blog post",
      icon: "📖",
      points: 30,
      requirements: "Stay on a blog post for 5 minutes"
    },
    
    // Special Achievements
    {
      title: "Early Bird",
      description: "Be among the first 100 visitors",
      icon: "🌅",
      points: 150,
      requirements: "Visit the site when total visitors < 100"
    },
    {
      title: "Night Owl",
      description: "Visit the site after midnight",
      icon: "🦉",
      points: 50,
      requirements: "Access the site between 12 AM and 4 AM"
    },
    
    // Easter Egg Achievements
    {
      title: "Secret Finder",
      description: "Discover a hidden easter egg",
      icon: "🥚",
      points: 200,
      requirements: "Find any hidden interactive element"
    },
    {
      title: "Code Detective",
      description: "Find the konami code easter egg",
      icon: "🕵️",
      points: 300,
      requirements: "Enter the konami code sequence"
    }
  ];

  try {
    for (const data of achievementData) {
      await db.insert(achievements).values(data);
    }
    console.log("Successfully seeded achievements table");
  } catch (error) {
    console.error("Error seeding achievements:", error);
  }
}

seedAchievements();
