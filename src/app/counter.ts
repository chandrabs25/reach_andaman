// Path: .\src\app\counter.ts
'use server' // Keep 'use server' if this is intended as a Server Action

// --- FIX: Remove incorrect import ---
// import { getCloudflareContext } from '@opennextjs/cloudflare' // Remove this line

// --- FIX: Import the initialized db instance ---
import { db } from '@/lib/database' // Import your db instance
// --- End of FIX ---

import { headers } from 'next/headers'

// Example function assuming you want to increment a counter in D1
// Adapt the table name ('visits') and logic as needed.
export async function incrementVisitCount() {
  try {
    // Access the D1 database directly via the imported 'db' instance
    // --- FIX: Use the imported 'db' instance ---
    // const { env } = getCloudflareContext() // Remove this line
    // const db = env.DB; // Remove this line - use the imported db directly
    // --- End of FIX ---

    // Example: Increment a counter in a 'visits' table
    // Adjust table/column names and query logic as needed for your specific schema
    const result = await db.prepare(
        `INSERT INTO visits (path, count, last_visited_at) VALUES (?, 1, CURRENT_TIMESTAMP)
         ON CONFLICT(path) DO UPDATE SET count = count + 1, last_visited_at = CURRENT_TIMESTAMP`
      )
      .bind('/') // Example: tracking visits to the root path
      .run();

    console.log('Visit count updated:', result);

    // Example: Fetch the new count (optional)
    const countResult = await db.prepare(
        `SELECT count FROM visits WHERE path = ?`
      )
      .bind('/')
      .first<{ count: number }>();

    return { success: true, count: countResult?.count ?? 0 };

  } catch (error) {
    console.error('Error incrementing visit count:', error);
    return { success: false, error: 'Failed to update visit count' };
  }
}

// Example function to get the count
export async function getVisitCount() {
    try {
        const countResult = await db.prepare(
            `SELECT count FROM visits WHERE path = ?`
          )
          .bind('/')
          .first<{ count: number }>();

        return { success: true, count: countResult?.count ?? 0 };
    } catch (error) {
        console.error('Error getting visit count:', error);
        return { success: false, count: 0, error: 'Failed to get visit count' };
    }
}

// You might have other functions or logic in this file...
// Keep the rest of your file's logic as it was.