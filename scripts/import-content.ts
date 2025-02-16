import { storage } from "../server/storage";
import { lifeStoryFinal as lifeStory, lifePurpose } from "../attached_assets/website-content-part3.js";

async function importContent() {
  try {
    // Import Life Story
    for (const section of lifeStory.sections) {
      await storage.createLifeStory({
        title: section.title,
        content: section.content,
        order: lifeStory.sections.indexOf(section),
      });
    }

    // Import Life Purpose
    await storage.createLifePurpose({
      summary: lifePurpose.summary,
      opportunities: lifePurpose.opportunities || [],
    });

    console.log('Content imported successfully!');
  } catch (error) {
    console.error('Error importing content:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
}

importContent();