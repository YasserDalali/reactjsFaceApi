import { useState, useEffect } from 'react';
import sb from '../database/supabase-client';

export const useFetchAbsences = () => {
    const [absences, setAbsences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAbsences = async () => {
            try {
                setLoading(true);
                const { data, error: supabaseError } = await sb
                    .from('attendance')
                    .select(`
                        id,
                        checkdate,
                        lateness,
                        employees (
                            id,
                            name
                        )
                    `);

                if (supabaseError) {
                    throw supabaseError;
                }

                // Transform the data to match the expected structure and filter out invalid entries
                const formattedAbsences = data
                    .filter(absence => absence.employees && absence.employees.name) // Filter out entries with missing employee data
                    .map(absence => ({
                        id: absence.id,
                        employee: absence.employees.name,
                        leaveType: absence.status || 'Unknown',
                        startDate: absence.checkdate,
                        endDate: absence.checkdate,
                        lateness: absence.lateness || 0
                    }));

                setAbsences(formattedAbsences);
            } catch (err) {
                console.error('Error fetching absences:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAbsences();
    }, []);

    return { absences, loading, error };
}; 