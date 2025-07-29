import { Client } from "@notionhq/client";

// Initialize Notion client
export const notion = new Client({
    auth: process.env.NOTION_INTEGRATION_SECRET!,
});

// Use the database ID directly from environment
export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID!;

// Contact form submission interface
export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Submit a contact form entry to the Notion database
 */
export async function submitContactToNotion(submission: ContactSubmission) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: NOTION_DATABASE_ID
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: submission.name
              }
            }
          ]
        },
        Email: {
          email: submission.email
        },
        Subject: {
          rich_text: [
            {
              text: {
                content: submission.subject
              }
            }
          ]
        },
        Message: {
          rich_text: [
            {
              text: {
                content: submission.message
              }
            }
          ]
        },
        "Submission Date": {
          date: {
            start: new Date().toISOString()
          }
        },
        Status: {
          select: {
            name: "New"
          }
        }
      }
    });

    return {
      success: true,
      notionPageId: response.id
    };
  } catch (error) {
    console.error("Error submitting to Notion:", error);
    throw new Error("Failed to submit contact form to Notion");
  }
}

/**
 * Get the database schema to understand available properties
 */
export async function getNotionDatabaseSchema() {
  try {
    const database = await notion.databases.retrieve({
      database_id: NOTION_DATABASE_ID
    });
    
    return database.properties;
  } catch (error) {
    console.error("Error fetching Notion database schema:", error);
    throw error;
  }
}