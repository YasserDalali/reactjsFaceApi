import { useState, useEffect } from 'react';
import sb from '../database/supabase-client';

export const useFetchAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                setLoading(true);
                const { data, error: supabaseError } = await sb
                    .from('attendance')
                    .select(`
                        *,
                        employees (
                            name
                        )
                    `);

                if (supabaseError) {
                    throw supabaseError;
                }

                setAttendance(data || []);
            } catch (err) {
                console.error('Error fetching attendance:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    return { attendance, loading, error };
};