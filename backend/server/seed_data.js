
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Event from './models/Event.js';
import path from 'path';

// Load env vars
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    console.log('🌱 Starting Seeding Process...');

    try {
        // 1. Clean existing data (Optional: comment out if you want to keep existing data)
        // await User.deleteMany({});
        // await Event.deleteMany({});
        // console.log('Deleted existing data.');

        // Helper to hash password
        const hashedPassword = await bcrypt.hash('123456', 10);

        // 2. Create Users
        const users = [
            {
                name: 'Tech Admin',
                email: 'tech@club.com',
                password: hashedPassword,
                role: 'club-admin',
                clubName: 'Tech Society',
                isVerified: true,
                verificationDocument: { data: Buffer.from('mock'), contentType: 'text/plain' }
            },
            {
                name: 'Cultural Admin',
                email: 'cultural@club.com',
                password: hashedPassword,
                role: 'club-admin',
                clubName: 'Cultural Committee',
                isVerified: true,
                verificationDocument: { data: Buffer.from('mock'), contentType: 'text/plain' }
            },
            {
                name: 'Sports Admin',
                email: 'sports@club.com',
                password: hashedPassword,
                role: 'club-admin',
                clubName: 'Sports Union',
                isVerified: true,
                verificationDocument: { data: Buffer.from('mock'), contentType: 'text/plain' }
            },
            {
                name: 'John Doe',
                email: 'john@google.com',
                password: hashedPassword,
                role: 'alumni-individual',
                isVerified: true,
                formerInstitution: 'MIT 2015',
                verificationDocument: { data: Buffer.from('mock'), contentType: 'text/plain' }
            },
            {
                name: 'Tech Corp',
                email: 'contact@techcorp.com',
                password: hashedPassword,
                role: 'company',
                organizationName: 'Tech Corp Inc.',
                isVerified: true,
                verificationDocument: { data: Buffer.from('mock'), contentType: 'text/plain' }
            }
        ];

        const createdUsers = [];
        for (const u of users) {
            // Check if user exists to avoid duplicates
            const existing = await User.findOne({ email: u.email });
            if (!existing) {
                const newUser = await User.create(u);
                createdUsers.push(newUser);
                console.log(`Created user: ${u.email}`);
            } else {
                createdUsers.push(existing);
                console.log(`User already exists: ${u.email}`);
            }
        }

        const [techClub, cultClub, sportsClub, alumni, company] = createdUsers;

        // 3. Create Events
        // Mock image buffer (1x1 transparent user mainly)
        const mockBuffer = Buffer.from('See database for file content');

        const events = [
            {
                title: 'TechHack 2025',
                description: 'A 48-hour hackathon bringing together the brightest minds to solve real-world problems. Tracks include AI, Blockchain, and IoT.',
                date: new Date('2025-03-15'),
                time: '10:00 AM',
                location: 'Main Auditorium',
                category: 'Technical',
                budget: 50000,
                raised: 15000,
                organizer: techClub._id,
                poster: { data: mockBuffer, contentType: 'image/png' },
                brochure: { data: mockBuffer, contentType: 'application/pdf' },
                status: 'open',
                sponsors: [
                    { sponsor: alumni._id, amount: 5000, date: new Date() },
                    { sponsor: company._id, amount: 10000, date: new Date() }
                ]
            },
            {
                title: 'RoboWars Championship',
                description: 'Witness the ultimate battle of bots! Teams from across the country compete for the championship title.',
                date: new Date('2025-04-20'),
                time: '02:00 PM',
                location: 'Open Air Theatre',
                category: 'Technical',
                budget: 80000,
                raised: 0,
                organizer: techClub._id,
                poster: { data: mockBuffer, contentType: 'image/png' },
                brochure: { data: mockBuffer, contentType: 'application/pdf' },
                status: 'open',
                sponsors: []
            },
            {
                title: 'Cultural Night: Rhythms',
                description: 'An evening of music, dance, and celebration. Featuring performances by student bands and a celebrity guest.',
                date: new Date('2025-02-28'),
                time: '06:00 PM',
                location: 'College Ground',
                category: 'Cultural',
                budget: 150000,
                raised: 45000,
                organizer: cultClub._id,
                poster: { data: mockBuffer, contentType: 'image/png' },
                brochure: { data: mockBuffer, contentType: 'application/pdf' },
                status: 'open',
                sponsors: [
                    { sponsor: company._id, amount: 45000, date: new Date() }
                ]
            },
            {
                title: 'Inter-College Football League',
                description: 'The biggest sports tournament of the year. 16 teams, one trophy.',
                date: new Date('2025-05-10'),
                time: '09:00 AM',
                location: 'Sports Complex',
                category: 'Sports',
                budget: 60000,
                raised: 10000,
                organizer: sportsClub._id,
                poster: { data: mockBuffer, contentType: 'image/png' },
                brochure: { data: mockBuffer, contentType: 'application/pdf' },
                status: 'open',
                sponsors: [
                    { sponsor: alumni._id, amount: 10000, date: new Date() }
                ]
            }
        ];

        console.log('Creating events...');
        await Event.insertMany(events);
        console.log('✅ Sample Data Seeding Complete!');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

seedData();
