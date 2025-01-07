import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import AnimatedComponent from '../components/AnimatedComponent';
import { Camera, Shield, Sliders, Clock, RefreshCw } from 'lucide-react';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const [formData, setFormData] = useState(settings || {});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : 
                    type === 'number' ? parseFloat(value) :
                    type === 'range' ? parseFloat(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_SETTINGS', payload: formData });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_SETTINGS' });
    setFormData(settings);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <AnimatedComponent>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Face Detection Settings
        </h1>
      </AnimatedComponent>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatedComponent delay={0.1}>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera className="text-blue-500" size={24} />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Detection Configuration
                </h2>
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300"
              >
                <RefreshCw size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Detection Confidence (0-1)
                </label>
                <input
                  type="range"
                  name="detectionConfidence"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.detectionConfidence}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700"
                />
                <span className="text-sm text-gray-500 dark:text-neutral-400">
                  {formData.detectionConfidence}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Capture Interval (ms)
                </label>
                <input
                  type="number"
                  name="captureInterval"
                  value={formData.captureInterval}
                  onChange={handleChange}
                  min="500"
                  max="5000"
                  step="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Maximum Retries
                </label>
                <input
                  type="number"
                  name="maxRetries"
                  value={formData.maxRetries}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
          </div>
        </AnimatedComponent>

        <AnimatedComponent delay={0.2}>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="text-blue-500" size={24} />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Additional Settings
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="text-green-500" size={20} />
                  <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Enable Notifications
                  </label>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="enableNotifications"
                    checked={formData.enableNotifications}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="text-purple-500" size={20} />
                  <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Save Detection Images
                  </label>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="saveDetectionImages"
                    checked={formData.saveDetectionImages}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </AnimatedComponent>
      </div>

      <AnimatedComponent delay={0.3}>
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
          >
            Save Settings
          </button>
        </div>
      </AnimatedComponent>
    </motion.div>
  );
};

export default SettingsPage;