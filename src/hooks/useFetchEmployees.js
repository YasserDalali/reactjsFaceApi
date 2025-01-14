import { useState, useEffect } from 'react';
import sb from '../database/supabase-client';

export const useFetchEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const { data, error: supabaseError } = await sb
                    .from('employees')
                    .select('*');

                if (supabaseError) {
                    throw supabaseError;
                }

                setEmployees(data || []);
            } catch (err) {
                console.error('Error fetching employees:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    return { employees, loading, error };
};