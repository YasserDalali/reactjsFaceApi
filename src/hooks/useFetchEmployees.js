import { useState, useEffect, useCallback } from 'react';
import supabase from '../database/supabase-client';

export const useFetchEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEmployees = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('employees')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            setEmployees(data);
        } catch (err) {
            console.error('Error fetching employees:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    return { employees, loading, error, refetch: fetchEmployees };
};