const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb+srv://hannah_db_user:1G8aBCtE6d33BrUV@switchyardfx.7xnfudt.mongodb.net/';

async function seedAdmin() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('switchyard_fx');
    
    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({ email: 'admin@switchyard.com' });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('\n📧 Email: admin@switchyard.com');
      console.log('🔒 Password: (use existing password or delete user first)');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('Admin2026!', 10);
    
    // Create admin user
    const adminUser = {
      email: 'admin@switchyard.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      company: 'SwitchYard FX',
      position: 'Administrator',
      phone: '+61 400 000 000',
      active: true,
      createdAt: new Date(),
      lastLogin: null
    };
    
    const result = await db.collection('users').insertOne(adminUser);
    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Email: admin@switchyard.com');
    console.log('🔒 Password: Admin2026!');
    console.log('👤 Role: admin');
    console.log(`🆔 User ID: ${result.insertedId}`);
    
    // Create default preferences
    await db.collection('preferences').insertOne({
      userId: result.insertedId,
      currencies: ['AUD', 'USD', 'EUR', 'GBP', 'JPY', 'NZD'],
      topics: ['market-updates', 'policy-changes', 'volatility-alerts'],
      interests: ['hedging', 'forwards', 'options'],
      feedLayout: {
        liveRates: true,
        marketNews: true,
        newsletters: true,
        rssFeed: true,
        hedgingDocs: true,
        products: true
      },
      notifications: {
        email: true,
        frequency: 'daily'
      },
      updatedAt: new Date()
    });
    
    console.log('✅ Admin preferences created');
    
    // Also create a test regular user
    const testUserPassword = await bcrypt.hash('User2026!', 10);
    const testUser = {
      email: 'user@switchyard.com',
      password: testUserPassword,
      name: 'Test User',
      role: 'user',
      company: 'Test Company',
      position: 'CFO',
      phone: '+61 400 111 222',
      active: true,
      createdAt: new Date(),
      lastLogin: null
    };
    
    const userResult = await db.collection('users').insertOne(testUser);
    console.log('\n✅ Test user created successfully!');
    console.log('\n📧 Email: user@switchyard.com');
    console.log('🔒 Password: User2026!');
    console.log('👤 Role: user');
    console.log(`🆔 User ID: ${userResult.insertedId}`);
    
    // Create test user preferences
    await db.collection('preferences').insertOne({
      userId: userResult.insertedId,
      currencies: ['AUD', 'USD'],
      topics: ['market-updates'],
      interests: [],
      feedLayout: {
        liveRates: true,
        marketNews: true,
        newsletters: true,
        rssFeed: false,
        hedgingDocs: true,
        products: true
      },
      notifications: {
        email: true,
        frequency: 'weekly'
      },
      updatedAt: new Date()
    });
    
    console.log('✅ Test user preferences created');
    
    // Create some sample market content
    const sampleContent = [
      {
        title: 'AUD/USD Market Commentary - February 2026',
        content: 'The Australian Dollar has shown resilience against the US Dollar in recent trading sessions. Key factors include strong commodity prices and positive employment data from Australia. Market volatility remains moderate with the pair trading in a tight range.',
        type: 'commentary',
        visibility: 'public',
        author: 'Admin User',
        publishedAt: new Date(),
        updatedAt: new Date(),
        tags: ['AUD', 'USD', 'market-analysis'],
        currencies: ['AUD', 'USD']
      },
      {
        title: 'FX Hedging Policy Template for CFOs',
        content: 'This comprehensive guide provides a framework for developing an effective FX hedging policy. It covers risk assessment, hedging strategies, reporting requirements, and governance structures suitable for mid-market companies.',
        type: 'policy',
        visibility: 'members-only',
        author: 'Admin User',
        publishedAt: new Date(),
        updatedAt: new Date(),
        tags: ['hedging', 'policy', 'risk-management'],
        currencies: []
      },
      {
        title: 'Forward Contracts vs Options: Which is Right for You?',
        content: 'Understanding the differences between forward contracts and options is crucial for effective FX risk management. This article explores the benefits and drawbacks of each instrument.',
        type: 'product',
        visibility: 'public',
        author: 'Admin User',
        publishedAt: new Date(),
        updatedAt: new Date(),
        tags: ['forwards', 'options', 'products'],
        currencies: []
      }
    ];
    
    await db.collection('market_content').insertMany(sampleContent);
    console.log('\n✅ Sample market content created (3 items)');
    
    console.log('\n🎉 Database seeding complete!');
    console.log('\n📝 Login URLs:');
    console.log('   Admin Dashboard: http://localhost:3000/dashboard/admin');
    console.log('   User Dashboard:  http://localhost:3000/dashboard');
    console.log('   Login Page:      http://localhost:3000/login');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

seedAdmin();
