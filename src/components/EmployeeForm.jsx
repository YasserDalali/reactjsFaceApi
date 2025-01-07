import React from 'react';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EmployeeForm = ({ onClose }) => {
  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        jobTitle: '',
        phone: '',
      }}
      validationSchema={Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string()
          .email('Invalid email address')
          .required('Email is required'),
        jobTitle: Yup.string().required('Job title is required'),
        phone: Yup.string().required('Phone number is required'),
      })}
      onSubmit={(values, { resetForm }) => {
        // Placeholder logic for saving the form
        alert('Form submitted:', values);

        // Call onClose to close the modal
        onClose();

        // Optionally reset the form after submission
        resetForm();
      }}
    >
      <Form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <Field
            name="name"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="name"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Field
            name="email"
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="email"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <Field
            name="jobTitle"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="jobTitle"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <Field
            name="phone"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="phone"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Employee
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default EmployeeForm;
