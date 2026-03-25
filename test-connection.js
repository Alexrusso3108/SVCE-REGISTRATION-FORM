// Test script to verify connection to your existing Docker database
const { Pool } = require('pg');

// Configuration for your existing Docker database
const dbConfig = {
    host: '100.78.37.57',
    port: 5434,
    database: 'admission_dash',
    user: 'postgres',
    password: '123456',
};

async function testConnection() {
    console.log('🔄 Testing connection to existing Docker database...');
    console.log(`📍 Connecting to: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    
    const pool = new Pool(dbConfig);
    
    try {
        // Test basic connection
        console.log('1️⃣ Testing basic connection...');
        const client = await pool.connect();
        console.log('✅ Basic connection successful!');
        
        // Test database version
        console.log('2️⃣ Checking PostgreSQL version...');
        const versionResult = await client.query('SELECT version()');
        console.log(`📊 Database version: ${versionResult.rows[0].version.split(' ').slice(0, 2).join(' ')}`);
        
        // Check if admission_enquiries table exists
        console.log('3️⃣ Checking if admission_enquiries table exists...');
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'admission_enquiries'
            );
        `);
        
        if (tableCheck.rows[0].exists) {
            console.log('✅ admission_enquiries table exists!');
            
            // Count existing records
            const countResult = await client.query('SELECT COUNT(*) FROM admission_enquiries');
            console.log(`📈 Existing records: ${countResult.rows[0].count}`);
        } else {
            console.log('⚠️  admission_enquiries table does not exist yet');
            console.log('📝 You need to run the SQL schema first');
        }
        
        // List all tables in the database
        console.log('4️⃣ Listing all tables in database...');
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);
        
        if (tablesResult.rows.length > 0) {
            console.log('📋 Existing tables:');
            tablesResult.rows.forEach(row => {
                console.log(`   - ${row.table_name}`);
            });
        } else {
            console.log('📋 No tables found in public schema');
        }
        
        client.release();
        console.log('\n🎉 Connection test completed successfully!');
        
    } catch (error) {
        console.error('\n❌ Connection test failed:');
        console.error(`   Error: ${error.message}`);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('   💡 Possible solutions:');
            console.error('      - Check if Docker containers are running: docker ps');
            console.error('      - Verify PostgreSQL is accessible on port 5434');
            console.error('      - Check Tailscale connection');
        } else if (error.code === '28P01') {
            console.error('   💡 Authentication failed - check username/password');
        } else if (error.code === '3D000') {
            console.error('   💡 Database does not exist - check database name');
        }
    } finally {
        await pool.end();
    }
}

// Run the test
testConnection().catch(console.error);