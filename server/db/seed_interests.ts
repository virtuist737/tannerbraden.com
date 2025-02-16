
import { db } from "../db";
import { interests } from "@shared/schema";

async function seedInterests() {
  const interestData = [
    // Learning
    { category: "Learning", type: "interests", item: "Español", sortOrder: 1 },
    { category: "Learning", type: "interests", item: "Coding", sortOrder: 2 },
    
    // Musical Instruments
    { category: "Musical Instruments", type: "instruments", item: "Piano", sortOrder: 1 },
    { category: "Musical Instruments", type: "instruments", item: "Guitar", sortOrder: 2 },
    { category: "Musical Instruments", type: "instruments", item: "Ukulele", sortOrder: 3 },
    
    // Sports
    { category: "Sports", type: "activities", item: "Cycling", sortOrder: 1 },
    { category: "Sports", type: "activities", item: "Hiking", sortOrder: 2 },
    { category: "Sports", type: "activities", item: "Tennis", sortOrder: 3 },
    
    // Media
    { category: "Media", type: "interests", item: "Books", sortOrder: 1 },
    { category: "Media", type: "interests", item: "Podcasts", sortOrder: 2 }
  ];

  try {
    for (const data of interestData) {
      await db.insert(interests).values(data);
    }
    console.log("Successfully seeded interests table");
  } catch (error) {
    console.error("Error seeding interests:", error);
  }
}

seedInterests();
