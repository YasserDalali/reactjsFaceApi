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
                    .from('attendance') // Assuming attendance table holds absence data
                    .select(`
                        id,
                        checkdate,
                        lateness,
                        employees (
                            name
                        )
                    `);

                if (supabaseError) {
                    throw supabaseError;
                }

                // Transform the data to match the expected structure
                const formattedAbsences = data.map(absence => ({
                    id: absence.id,
                    employee: absence.employees.name,
                    leaveType: absence.status, // Assuming status indicates leave type
                    startDate: absence.checkdate, // Adjust as necessary
                    endDate: absence.checkdate, // Adjust as necessary
                }));

                setAbsences(formattedAbsences || []);
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