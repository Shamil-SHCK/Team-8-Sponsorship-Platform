import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Profile from './models/Profile.js';

dotenv.config();

const migrateUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Migration');

        // Access raw collection to get fields that are no longer in the schema
        const usersCollection = mongoose.connection.db.collection('users');
        const allUsers = await usersCollection.find({}).toArray();

        console.log(`Found ${allUsers.length} users. Starting migration...`);

        let migratedCount = 0;

        for (const rawUser of allUsers) {
            // Check if user already has a profile linked (skip if so)
            if (rawUser.profile) {
                console.log(`User ${rawUser.email} already has a profile. Skipping.`);
                continue;
            }

            console.log(`Migrating user: ${rawUser.email} (${rawUser.role})`);

            // Extract profile fields from raw user doc
            const profileData = {
                user: rawUser._id,
                clubName: rawUser.clubName,
                collegeName: rawUser.collegeName,
                organizationName: rawUser.organizationName,
                formerInstitution: rawUser.formerInstitution,
                phone: rawUser.phone,
                logoUrl: rawUser.logoUrl,
                description: rawUser.description,
                verificationDocument: rawUser.verificationDocument
            };

            // Remove undefined/null keys to keep it clean
            Object.keys(profileData).forEach(key => {
                if (profileData[key] === undefined || profileData[key] === null) {
                    delete profileData[key];
                }
            });

            // Create Profile
            const newProfile = await Profile.create(profileData);

            // Update User: link profile and unset old fields
            await usersCollection.updateOne(
                { _id: rawUser._id },
                {
                    $set: { profile: newProfile._id },
                    $unset: {
                        clubName: "",
                        collegeName: "",
                        organizationName: "",
                        formerInstitution: "",
                        phone: "",
                        logoUrl: "",
                        description: "",
                        verificationDocument: ""
                    }
                }
            );

            migratedCount++;
        }

        console.log(`Migration completed. Migrated ${migratedCount} users.`);
        process.exit();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateUsers();
