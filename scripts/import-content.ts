import { storage } from "../server/storage";
import { lifeStory, lifePurpose, personality, philosophy, experience, recommendations, hobbies } from "../attached_assets/website-content-part3.js";

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
      opportunities: lifePurpose.opportunities,
    });

    // Import Personality Traits
    for (const trait of personality.bigFive.traits) {
      await storage.createPersonalityTrait({
        category: 'bigFive',
        name: trait.name,
        description: trait.description,
      });
    }

    for (const trait of personality.mbti.traits) {
      await storage.createPersonalityTrait({
        category: 'mbti',
        name: trait.trait,
        description: trait.description,
      });
    }

    // Import Personality Weaknesses
    for (const weakness of personality.weaknesses) {
      await storage.createPersonalityWeakness({
        weakness,
      });
    }

    // Import Philosophy
    const philosophyEntries = [
      {
        category: 'virtues',
        title: 'Virtues',
        content: JSON.stringify(philosophy.virtues),
      },
      {
        category: 'freeWill',
        title: 'Free Will',
        content: JSON.stringify(philosophy.freeWill),
      },
      {
        category: 'religion',
        title: 'Religion',
        content: JSON.stringify(philosophy.religion),
      },
    ];

    for (const entry of philosophyEntries) {
      await storage.createPhilosophy(entry);
    }

    // Import Professional Experience
    for (const exp of experience.professional) {
      await storage.createExperience({
        company: exp.company,
        role: exp.role,
        type: exp.type,
        period: exp.period,
        duration: exp.duration,
        responsibilities: exp.responsibilities || [],
        achievements: exp.achievements || [],
      });
    }

    console.log('Content imported successfully!');
  } catch (error) {
    console.error('Error importing content:', error);
  }
}

importContent();
