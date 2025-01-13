import { createClient } from '@supabase/supabase-js';


const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
const supabaseAPI = import.meta.env.VITE_SUPABASE_API_KEY;

// Validate environment variables
if (!supabaseURL || !supabaseAPI) {
    throw new Error('Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_API_KEY are set.');
}

// Create client with error handling
let sb;
try {
    sb = createClient(supabaseURL, supabaseAPI);
    console.log('Supabase client created successfully');
} catch (error) {
    console.error('Error creating Supabase client:', error);
    throw error;
}

export default sb;