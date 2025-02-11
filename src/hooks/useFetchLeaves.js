import { useState, useEffect } from 'react';
import sb from '../database/supabase-client';

export const useFetchLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                setLoading(true);
                const { data, error: supabaseError } = await sb
                    .from('leaves')
                    .select('*');

                if (supabaseError) {
                    throw supabaseError;
                }

                setLeaves(data || []);
            } catch (err) {
                console.error('Error fetching leaves:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaves();
    }, []);

    return { leaves, loading, error };
};