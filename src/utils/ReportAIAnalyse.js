import { GoogleGenerativeAI } from "@google/generative-ai";
import sb from '../database/supabase-client';

// Get employee and attendance data
export const employeeRecords = async () => {
    try {
        const { data: employees, error: employeeError } = await sb
            .from('employees')
            .select(`*`);

        const { data: attendance, error: attendanceError } = await sb
            .from('attendance')
            .select(`*`);

        if (employeeError) throw employeeError;
        if (attendanceError) throw attendanceError;

        return { employees, attendance };

    } catch (error) {
        console.error('Error fetching employee records:', error);
        return { employees: [], attendance: [] };
    }
};

export const attendanceRecords = async () => {
    try {
        const { data: attendance, error: attendanceError } = await sb
            .from('attendance')
            .select(`*`);
        return attendance;
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        return { attendance: [] };
    }
}

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

const REPORT_CACHE_KEY = 'ai_report_cache';

// Helper function to get cache data
const getReportCache = () => {
    try {
        return JSON.parse(localStorage.getItem(REPORT_CACHE_KEY) || '{}');
    } catch {
        return {};
    }
};

// Helper function to save cache data
const saveReportCache = (data, employeeData) => {
    const cache = {
        timestamp: Date.now(),
        data,
        employeeDataHash: JSON.stringify(employeeData)
    };
    localStorage.setItem(REPORT_CACHE_KEY, JSON.stringify(cache));
};

// Helper function to check if cache is valid
const isCacheValid = (cache, currentData) => {
    if (!cache.timestamp || !cache.data || !cache.employeeDataHash) return false;

    // Check if data is from today
    const today = new Date().toDateString();
    const cacheDate = new Date(cache.timestamp).toDateString();
    if (today !== cacheDate) return false;

    // Check if employee data has changed
    return cache.employeeDataHash === JSON.stringify(currentData);
};

export const generateAIReport = async () => {
    try {
        // Get employee data first
        const employeeData = await employeeRecords();
        const attendanceData = await attendanceRecords();
        console.log('Retrieved employee data:', employeeData);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Analyze this employee data and provide insights focusing on:
1. High Attrition Risk: Identify employees with low satisfaction or poor feedback
2. Lateness Patterns: Correlate lateness with satisfaction
3. Training Effectiveness: Relate training hours to project performance
4. Workload Balance: Analyze overtime and absenteeism
5. Engagement Levels: Use satisfaction and feedback metrics

Data Employees: ${JSON.stringify(employeeData)}
Data Attendance: ${JSON.stringify(attendanceData)}

Return ONLY a valid JSON object with this structure (no markdown, no backticks, no json keyword):
{
  "highRiskEmployees": ["Employee Name 1 (hours late)", "Employee Name 2 (hours late)", ...],
  "latenessAnalysis": "Analysis text here",
  "trainingImpact": "Analysis text here",
  "workloadConcerns": "Analysis text here",
  "engagementSummary": "Analysis text here",
  "recommendations": ["Recommendation 1", "Recommendation 2", ...]
}
  
Instructions:
- Provide clear, data-driven insights with specific metrics and context
- Use simple, understandable language`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean and parse the response
        const cleanJson = responseText
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        try {
            const response = JSON.parse(cleanJson);
            saveReportCache(response, employeeData);
            return response;
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            throw new Error('Invalid response format from AI');
        }
    } catch (error) {
        console.error("Error generating AI report:", error);
        throw error;
    }
};