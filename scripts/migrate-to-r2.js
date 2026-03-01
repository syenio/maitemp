const { MongoClient } = require('mongodb');
require('dotenv').config();

async function findCloudinaryReferences() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    const collections = ['users', 'serviceProviders', 'services', 'reviews'];
    
    for (const collectionName of collections) {
      console.log(`\nChecking ${collectionName} collection...`);
      
      const collection = db.collection(collectionName);
      
      const docs = await collection.find({
        $or: [
          { profileImage: { $regex: /cloudinary\.com/i } },
          { image: { $regex: /cloudinary\.com/i } },
          { images: { $regex: /cloudinary\.com/i } },
          { avatar: { $regex: /cloudinary\.com/i } },
          { photo: { $regex: /cloudinary\.com/i } }
        ]
      }).toArray();
      
      if (docs.length > 0) {
        console.log(`Found ${docs.length} documents with Cloudinary URLs:`);
        docs.forEach(doc => {
          console.log(`- ID: ${doc._id}`);
          // Log relevant image fields
          ['profileImage', 'image', 'images', 'avatar', 'photo'].forEach(field => {
            if (doc[field] && typeof doc[field] === 'string' && doc[field].includes('cloudinary.com')) {
              console.log(`  ${field}: ${doc[field]}`);
            }
          });
        });
      } else {
        console.log('No Cloudinary URLs found');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

// Run the script
if (require.main === module) {
  findCloudinaryReferences()
    .then(() => {
      console.log('\nMigration check complete!');
      console.log('Note: This script only identifies existing Cloudinary URLs.');
      console.log('You will need to manually update these URLs to point to your R2 bucket.');
    })
    .catch(console.error);
}

module.exports = { findCloudinaryReferences };