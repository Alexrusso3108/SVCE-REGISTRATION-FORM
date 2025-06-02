// Supabase configuration

// =================================================================
// IMPORTANT: Replace these values with your actual Supabase credentials
// You can find these in your Supabase dashboard under Settings > API
// =================================================================
const SUPABASE_URL = 'https://danfcilutplomwluegll.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbmZjaWx1dHBsb213bHVlZ2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2ODI2MjEsImV4cCI6MjA2NDI1ODYyMX0.T6mS6KvKrs1LgrVZStYtfUo4QUYg-TLxu4S7dp9BVSw';

// Initialize the Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
