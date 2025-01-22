import { createClient } from '@supabase/supabase-js';
// Get environment variables
const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
const supabaseAPI = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables with detailed error messages
if (!supabaseURL) {
    throw new Error(
        'VITE_SUPABASE_URL is not set in environment variables. ' +
        'Please check your .env file and ensure it matches .env.example'
    );
}

if (!supabaseAPI) {
    throw new Error(
        'VITE_SUPABASE_API_KEY is not set in environment variables. ' +
        'Please check your .env file and ensure it matches .env.example'
    );
}

// Create client with error handling
let supabase;
try {
    supabase = createClient(supabaseURL, supabaseAPI, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    });

    // Test the connection
    const testConnection = async () => {
        const { error } = await supabase.from('employees').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('Error connecting to Supabase:', error.message);
            throw error;
        }
        console.log('Successfully connected to Supabase');
    };

    testConnection().catch(console.error);
} catch (error) {
    console.error('Error initializing Supabase client:', error);
    throw error;
}

export default supabase;