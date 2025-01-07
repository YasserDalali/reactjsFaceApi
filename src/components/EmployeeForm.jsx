import React, { useState, useRef } from 'react';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import Webcam from 'react-webcam';

const EmployeeForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        position: '',
        phone: '',
      }}
      validationSchema={Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string()
          .email('Invalid email address')
          .required('Email is required'),
        position: Yup.string().required('Position is required'),
        phone: Yup.string().required('Phone number is required'),
      })}
      onSubmit={(values, { resetForm }) => {
        if (!image) {
          alert('Please capture an image first');
          return;
        }
        
        dispatch({
          type: 'ADD_EMPLOYEE',
          payload: {
            id: Date.now(),
            ...values,
            photo: image,
            startDate: new Date().toISOString().split('T')[0],
            leaveBalance: 20,
          }
        });
        onClose();
        resetForm();
        setImage(null);
      }}
    >
      <Form className="flex gap-6">
        {/* Left Column - Form Fields */}
        <div className="flex-1 space-y-4">
          <div>
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

          <div>
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

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">
              Position
            </label>
            <Field
              name="position"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage
              name="position"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div>
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
              disabled={!image}
            >
              Add Employee
            </button>
          </div>
        </div>

        {/* Right Column - Webcam */}
        <div className="w-96">
          <div className="sticky top-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee Photo
            </label>
            {!image ? (
              <div className="space-y-2">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-md"
                />
                <button
                  type="button"
                  onClick={capture}
                  className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Capture Photo
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <img src={image} alt="Employee" className="w-full rounded-md" />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="w-full py-2 px-4 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Retake Photo
                </button>
              </div>
            )}
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default EmployeeForm;
