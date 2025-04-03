import { D1Database } from '@cloudflare/workers-types';

// Create a global db variable that will be initialized
let globalDb: D1Database;

// Sample data for mock database
const mockData = {
  users: [
    { id: 1, email: 'user@example.com', password_hash: 'hashed_password', first_name: 'John', last_name: 'Doe', phone: '9876543210', role_id: 1 },
    { id: 2, email: 'vendor@example.com', password_hash: 'hashed_password', first_name: 'Jane', last_name: 'Smith', phone: '8765432109', role_id: 2 }
  ],
  islands: [
    { id: 1, name: 'Havelock Island', description: 'Home to Radhanagar Beach, one of Asia\'s best beaches', image_url: '/images/havelock.jpg', location: 'Andaman Islands' },
    { id: 2, name: 'Neil Island', description: 'Known for its pristine beaches and natural bridge', image_url: '/images/neil.jpg', location: 'Andaman Islands' },
    { id: 3, name: 'Port Blair', description: 'The capital city with historical Cellular Jail', image_url: '/images/port-blair.jpg', location: 'Andaman Islands' },
    { id: 4, name: 'Baratang Island', description: 'Famous for limestone caves and mud volcanoes', image_url: '/images/baratang.jpg', location: 'Andaman Islands' }
  ],
  services: [
    { id: 1, name: 'Scuba Diving', description: 'Explore vibrant coral reefs and marine life', image_url: '/images/scuba.jpg', price: 4500, duration: '3 hours', island_id: 1, provider_id: 1 },
    { id: 2, name: 'Glass Bottom Boat Tour', description: 'View the underwater world without getting wet', image_url: '/images/boat.jpg', price: 1800, duration: '2 hours', island_id: 1, provider_id: 1 },
    { id: 3, name: 'Sea Walking', description: 'Walk on the ocean floor with specialized equipment', image_url: '/images/sea-walking.jpg', price: 3500, duration: '2 hours', island_id: 2, provider_id: 2 },
    { id: 4, name: 'Kayaking', description: 'Paddle through mangroves and bioluminescent waters', image_url: '/images/kayaking.jpg', price: 2000, duration: '3 hours', island_id: 3, provider_id: 2 }
  ],
  packages: [
    { id: 1, name: 'Andaman Island Explorer', description: '7-day comprehensive tour of the major Andaman Islands', image_url: '/images/package1.jpg', price: 35000, duration: '7 days / 6 nights', is_active: 1 },
    { id: 2, name: 'Havelock Beach Retreat', description: 'Relaxing 4-day beach vacation on Havelock Island', image_url: '/images/package2.jpg', price: 22000, duration: '4 days / 3 nights', is_active: 1 },
    { id: 3, name: 'Adventure Package', description: 'Action-packed 5-day adventure with scuba, trekking and more', image_url: '/images/package3.jpg', price: 28000, duration: '5 days / 4 nights', is_active: 1 }
  ],
  bookings: [
    { id: 1, user_id: 1, package_id: 1, total_people: '2', start_date: '2025-05-10', end_date: '2025-05-17', total_amount: 70000 },
    { id: 2, user_id: 1, package_id: 2, total_people: '4', start_date: '2025-06-15', end_date: '2025-06-19', total_amount: 88000 }
  ],
  reviews: [
    { id: 1, user_id: 1, service_id: 1, rating: 5, comment: 'Amazing experience! The coral reefs were beautiful.', first_name: 'John', last_name: 'Doe' },
    { id: 2, user_id: 1, service_id: 2, rating: 4, comment: 'Great way to see marine life without getting wet.', first_name: 'John', last_name: 'Doe' }
  ],
  ferry_schedules: [
    { id: 1, ferry_id: 1, origin_id: 3, destination_id: 1, departure_time: '2025-04-15 08:00:00', arrival_time: '2025-04-15 10:30:00', price: 1200, ferry_name: 'Makruzz', capacity: 200 },
    { id: 2, ferry_id: 1, origin_id: 1, destination_id: 3, departure_time: '2025-04-15 14:00:00', arrival_time: '2025-04-15 16:30:00', price: 1200, ferry_name: 'Makruzz', capacity: 200 },
    { id: 3, ferry_id: 2, origin_id: 3, destination_id: 2, departure_time: '2025-04-15 09:30:00', arrival_time: '2025-04-15 11:30:00', price: 1000, ferry_name: 'Green Ocean', capacity: 150 }
  ],
  service_providers: [
    { id: 1, user_id: 2, business_name: 'Andaman Adventures', description: 'Premier adventure sports provider in Andaman', address: 'Beach No. 5, Havelock Island', is_verified: 1 }
  ]
};

// Initialize the database with the provided D1 instance
export function initializeDb(d1Database: D1Database) {
  globalDb = d1Database;
  return globalDb;
}

// Create a mock database for development and testing when not in production
if (typeof globalDb === 'undefined') {
  // This is a mock implementation for development
  globalDb = {
    prepare: (query: string) => {
      // Parse the query to determine which table to access
      const tableName = query.toLowerCase().includes('from') 
        ? query.toLowerCase().split('from')[1].trim().split(' ')[0] 
        : '';
      
      return {
        bind: (...args: any[]) => {
          return {
            first: async () => {
              // Handle specific queries based on the table
              if (tableName === 'users') {
                if (query.includes('email') && args[0]) {
                  return mockData.users.find(user => user.email === args[0]) || {};
                } else if (query.includes('id') && args[0]) {
                  return mockData.users.find(user => user.id === args[0]) || {};
                }
              } else if (tableName === 'islands' && query.includes('id') && args[0]) {
                return mockData.islands.find(island => island.id === args[0]) || {};
              } else if (tableName === 'services' && query.includes('id') && args[0]) {
                return mockData.services.find(service => service.id === args[0]) || {};
              } else if (tableName === 'packages' && query.includes('id') && args[0]) {
                return mockData.packages.find(pkg => pkg.id === args[0]) || {};
              } else if (tableName === 'service_providers' && query.includes('user_id') && args[0]) {
                return mockData.service_providers.find(provider => provider.user_id === args[0]) || {};
              }
              return {};
            },
            all: async () => {
              // Return appropriate mock data based on the query
              if (tableName === 'islands') {
                return mockData.islands;
              } else if (tableName === 'services') {
                if (query.includes('island_id') && args[0]) {
                  return mockData.services.filter(service => service.island_id === args[0]);
                } else if (query.includes('provider_id') && args[0]) {
                  return mockData.services.filter(service => service.provider_id === args[0]);
                }
                return mockData.services;
              } else if (tableName === 'packages') {
                return mockData.packages;
              } else if (tableName === 'bookings' && query.includes('user_id') && args[0]) {
                return mockData.bookings.filter(booking => booking.user_id === args[0]);
              } else if (tableName === 'reviews' && query.includes('service_id') && args[0]) {
                return mockData.reviews.filter(review => review.service_id === args[0]);
              } else if (tableName === 'ferry_schedules') {
                if (args.length >= 3) {
                  return mockData.ferry_schedules.filter(
                    schedule => 
                      schedule.origin_id === args[0] && 
                      schedule.destination_id === args[1] && 
                      schedule.departure_time.startsWith(args[2])
                  );
                }
                return mockData.ferry_schedules;
              }
              return [];
            },
            run: async () => ({ success: true }),
          };
        },
      };
    },
    execute: async (query: string, params?: any[]) => {
      // For direct execute queries, return appropriate mock data
      if (query.toLowerCase().includes('from islands')) {
        return mockData.islands;
      } else if (query.toLowerCase().includes('from services')) {
        return mockData.services;
      } else if (query.toLowerCase().includes('from packages')) {
        return mockData.packages;
      }
      return [];
    }
  } as unknown as D1Database;
}

// Export the db instance for direct use in API routes
export const db = globalDb;

// Database service for handling database operations
export class DatabaseService {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  // User methods
  async getUserByEmail(email: string) {
    return this.db
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first();
  }

  async getUserById(id: number) {
    return this.db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(id)
      .first();
  }

  async createUser(userData: {
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role_id: number;
  }) {
    return this.db
      .prepare(
        'INSERT INTO users (email, password_hash, first_name, last_name, phone, role_id) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .bind(
        userData.email,
        userData.password_hash,
        userData.first_name,
        userData.last_name,
        userData.phone || null,
        userData.role_id
      )
      .run();
  }

  // Island methods
  async getAllIslands() {
    return this.db.prepare('SELECT * FROM islands').all();
  }

  async getIslandById(id: number) {
    return this.db
      .prepare('SELECT * FROM islands WHERE id = ?')
      .bind(id)
      .first();
  }

  // Service methods
  async getServicesByIsland(islandId: number) {
    return this.db
      .prepare('SELECT * FROM services WHERE island_id = ?')
      .bind(islandId)
      .all();
  }

  async getServiceById(id: number) {
    return this.db
      .prepare('SELECT * FROM services WHERE id = ?')
      .bind(id)
      .first();
  }

  // Package methods
  async getAllPackages() {
    return this.db.prepare('SELECT * FROM packages WHERE is_active = 1').all();
  }

  async getPackageById(id: number) {
    return this.db
      .prepare('SELECT * FROM packages WHERE id = ?')
      .bind(id)
      .first();
  }

  // Booking methods
  async createBooking(bookingData: {
    user_id: number;
    package_id?: number;
    total_people: string;
    start_date: string;
    end_date: string;
    total_amount: number;
  }) {
    return this.db
      .prepare(
        'INSERT INTO bookings (user_id, package_id, total_people, start_date, end_date, total_amount) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .bind(
        bookingData.user_id,
        bookingData.package_id || null,
        bookingData.total_people,
        bookingData.start_date,
        bookingData.end_date,
        bookingData.total_amount
      )
      .run();
  }

  async getUserBookings(userId: number) {
    return this.db
      .prepare('SELECT * FROM bookings WHERE user_id = ?')
      .bind(userId)
      .all();
  }

  // Review methods
  async getServiceReviews(serviceId: number) {
    return this.db
      .prepare(`
        SELECT r.*, u.first_name, u.last_name 
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.service_id = ?
      `)
      .bind(serviceId)
      .all();
  }

  async createReview(reviewData: {
    user_id: number;
    service_id: number;
    rating: number;
    comment?: string;
  }) {
    return this.db
      .prepare(
        'INSERT INTO reviews (user_id, service_id, rating, comment) VALUES (?, ?, ?, ?)'
      )
      .bind(
        reviewData.user_id,
        reviewData.service_id,
        reviewData.rating,
        reviewData.comment || null
      )
      .run();
  }

  // Ferry methods
  async getFerrySchedules(originId: number, destinationId: number, date: string) {
    return this.db
      .prepare(`
        SELECT fs.*, f.name as ferry_name, f.capacity
        FROM ferry_schedules fs
        JOIN ferries f ON fs.ferry_id = f.id
        WHERE fs.origin_id = ? AND fs.destination_id = ? AND DATE(fs.departure_time) = ?
      `)
      .bind(originId, destinationId, date)
      .all();
  }

  // Vendor methods
  async getVendorByUserId(userId: number) {
    return this.db
      .prepare('SELECT * FROM service_providers WHERE user_id = ?')
      .bind(userId)
      .first();
  }

  async getVendorServices(providerId: number) {
    return this.db
      .prepare('SELECT * FROM services WHERE provider_id = ?')
      .bind(providerId)
      .all();
  }
}
