const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Habitat = require('../models/Habitat');
const Animal = require('../models/Animal');
const VisitorRecord = require('../models/VisitorRecord');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Habitat.deleteMany({});
    await Animal.deleteMany({});
    await VisitorRecord.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@zoo.com',
        password: 'password123',
        role: 'admin'
      },
      {
        username: 'john_keeper',
        email: 'john@zoo.com',
        password: 'password123',
        role: 'keeper'
      },
      {
        username: 'dr_smith',
        email: 'smith@zoo.com',
        password: 'password123',
        role: 'veterinarian'
      },
      {
        username: 'mary_keeper',
        email: 'mary@zoo.com',
        password: 'password123',
        role: 'keeper'
      }
    ]);
    console.log('Created users');

    // Create habitats
    const habitats = await Habitat.create([
      {
        name: 'African Savanna',
        type: 'outdoor',
        capacity: 15,
        description: 'Large outdoor habitat for African mammals',
        assignedStaff: [users[1]._id]
      },
      {
        name: 'Tropical Rainforest',
        type: 'indoor',
        capacity: 25,
        description: 'Climate-controlled environment for tropical species',
        assignedStaff: [users[3]._id]
      },
      {
        name: 'Arctic Tundra',
        type: 'outdoor',
        capacity: 8,
        description: 'Cold climate habitat for polar animals',
        assignedStaff: [users[1]._id]
      },
      {
        name: 'Reptile House',
        type: 'indoor',
        capacity: 30,
        description: 'Temperature-controlled facility for reptiles',
        assignedStaff: [users[3]._id]
      },
      {
        name: 'Aviary',
        type: 'outdoor',
        capacity: 50,
        description: 'Large flight enclosure for birds',
        assignedStaff: [users[1]._id]
      },
      {
        name: 'Aquarium',
        type: 'indoor',
        capacity: 100,
        description: 'Aquatic environment for fish and marine life',
        assignedStaff: [users[3]._id]
      }
    ]);
    console.log('Created habitats');

    // Update habitat occupancy
    await Habitat.findByIdAndUpdate(habitats[0]._id, { currentOccupancy: 2 });
    await Habitat.findByIdAndUpdate(habitats[1]._id, { currentOccupancy: 1 });
    await Habitat.findByIdAndUpdate(habitats[2]._id, { currentOccupancy: 1 });
    await Habitat.findByIdAndUpdate(habitats[3]._id, { currentOccupancy: 1 });
    await Habitat.findByIdAndUpdate(habitats[4]._id, { currentOccupancy: 1 });
    await Habitat.findByIdAndUpdate(habitats[5]._id, { currentOccupancy: 1 });

    // Create animals
    await Animal.create([
      {
        name: 'Simba',
        species: 'African Lion',
        category: 'mammals',
        age: 5,
        gender: 'male',
        healthStatus: 'healthy',
        habitat: habitats[0]._id,
        assignedKeeper: users[1]._id,
        notes: 'Alpha male of the pride'
      },
      {
        name: 'Nala',
        species: 'African Lion',
        category: 'mammals',
        age: 4,
        gender: 'female',
        healthStatus: 'healthy',
        habitat: habitats[0]._id,
        assignedKeeper: users[1]._id,
        notes: 'Pregnant female'
      },
      {
        name: 'Koko',
        species: 'Western Lowland Gorilla',
        category: 'mammals',
        age: 12,
        gender: 'female',
        healthStatus: 'healthy',
        habitat: habitats[1]._id,
        assignedKeeper: users[3]._id,
        notes: 'Very intelligent, knows sign language'
      },
      {
        name: 'Frost',
        species: 'Polar Bear',
        category: 'mammals',
        age: 8,
        gender: 'male',
        healthStatus: 'healthy',
        habitat: habitats[2]._id,
        assignedKeeper: users[1]._id,
        notes: 'Loves swimming'
      },
      {
        name: 'Slither',
        species: 'Burmese Python',
        category: 'reptiles',
        age: 3,
        gender: 'female',
        healthStatus: 'healthy',
        habitat: habitats[3]._id,
        assignedKeeper: users[3]._id,
        notes: 'Recently shed skin'
      },
      {
        name: 'Rainbow',
        species: 'Scarlet Macaw',
        category: 'birds',
        age: 6,
        gender: 'male',
        healthStatus: 'healthy',
        habitat: habitats[4]._id,
        assignedKeeper: users[1]._id,
        notes: 'Very vocal and colorful'
      },
      {
        name: 'Nemo',
        species: 'Clownfish',
        category: 'fish',
        age: 1,
        gender: 'unknown',
        healthStatus: 'healthy',
        habitat: habitats[5]._id,
        assignedKeeper: users[3]._id,
        notes: 'Popular with children'
      }
    ]);
    console.log('Created animals');

    // Create visitor records
    await VisitorRecord.create([
      {
        visitDate: new Date('2024-01-15'),
        adultTickets: 150,
        childTickets: 75,
        totalVisitors: 225,
        totalRevenue: 3375.00,
        notes: 'Busy weekend day'
      },
      {
        visitDate: new Date('2024-01-16'),
        adultTickets: 200,
        childTickets: 100,
        totalVisitors: 300,
        totalRevenue: 4500.00,
        notes: 'School group visit'
      },
      {
        visitDate: new Date('2024-01-17'),
        adultTickets: 80,
        childTickets: 40,
        totalVisitors: 120,
        totalRevenue: 1800.00,
        notes: 'Quiet weekday'
      }
    ]);
    console.log('Created visitor records');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();