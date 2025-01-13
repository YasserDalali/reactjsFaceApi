import React from 'react';
import { motion } from 'framer-motion';

const AIReportModal = ({ isOpen, onClose, reportData }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI Analysis Report</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {reportData ? (
                    <div className="space-y-6">
                        {/* High Risk Employees */}
                        <section className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">High Risk Employees</h3>
                            <ul className="list-disc list-inside text-red-700 dark:text-red-300">
                                {reportData.highRiskEmployees.map((employee, index) => (
                                    <li key={index}>{employee}</li>
                                ))}
                            </ul>
                        </section>

                        {/* Lateness Analysis */}
                        <section className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Lateness Patterns</h3>
                            <p className="text-blue-700 dark:text-blue-300">{reportData.latenessAnalysis}</p>
                        </section>

                        {/* Training Impact */}
                        <section className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">Training Effectiveness</h3>
                            <p className="text-green-700 dark:text-green-300">{reportData.trainingImpact}</p>
                        </section>

                        {/* Workload Concerns */}
                        <section className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">Workload Analysis</h3>
                            <p className="text-yellow-700 dark:text-yellow-300">{reportData.workloadConcerns}</p>
                        </section>

                        {/* Engagement Summary */}
                        <section className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">Engagement Levels</h3>
                            <p className="text-purple-700 dark:text-purple-300">{reportData.engagementSummary}</p>
                        </section>

                        {/* Recommendations */}
                        <section className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-3">Recommendations</h3>
                            <ul className="list-disc list-inside text-indigo-700 dark:text-indigo-300">
                                {reportData.recommendations.map((recommendation, index) => (
                                    <li key={index}>{recommendation}</li>
                                ))}
                            </ul>
                        </section>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AIReportModal; 