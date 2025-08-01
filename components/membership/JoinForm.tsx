'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, User, Mail, Phone, Calendar, Shield } from 'lucide-react';

interface FormData {
  name: string;
  age: string;
  email: string;
  mobile: string;
  membershipPlan: string;
  termsAccepted: boolean;
}

const membershipPlans = [
  { value: '', label: 'Select a membership plan' },
  { value: 'basic', label: 'Basic Member - ₹500/year' },
  { value: 'standard', label: 'Standard Member - ₹1,000/year' },
  { value: 'premium', label: 'Premium Member - ₹2,500/year' },
  { value: 'lifetime', label: 'Lifetime Member - ₹10,000' }
];

export default function JoinForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    email: '',
    mobile: '',
    membershipPlan: '',
    termsAccepted: false
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    console.log('Form submitted:', formData);
  };

  const inputVariants = {
    focused: {
      scale: 1.02,
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      transition: { duration: 0.2 }
    },
    unfocused: {
      scale: 1,
      boxShadow: '0 0 0 0px rgba(59, 130, 246, 0)',
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            <User className="w-4 h-4 inline mr-2" />
            Full Name
          </label>
          <motion.input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleInputChange}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            variants={inputVariants}
            animate={focusedField === 'name' ? 'focused' : 'unfocused'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
            placeholder="Enter your full name"
          />
        </div>

        {/* Age Field */}
        <div className="space-y-2">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 inline mr-2" />
            Age
          </label>
          <motion.input
            id="age"
            name="age"
            type="number"
            required
            min="16"
            max="100"
            value={formData.age}
            onChange={handleInputChange}
            onFocus={() => setFocusedField('age')}
            onBlur={() => setFocusedField(null)}
            variants={inputVariants}
            animate={focusedField === 'age' ? 'focused' : 'unfocused'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
            placeholder="Enter your age"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address
          </label>
          <motion.input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            variants={inputVariants}
            animate={focusedField === 'email' ? 'focused' : 'unfocused'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
            placeholder="Enter your email address"
          />
        </div>

        {/* Mobile Field */}
        <div className="space-y-2">
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
            <Phone className="w-4 h-4 inline mr-2" />
            Mobile Number
          </label>
          <motion.input
            id="mobile"
            name="mobile"
            type="tel"
            required
            value={formData.mobile}
            onChange={handleInputChange}
            onFocus={() => setFocusedField('mobile')}
            onBlur={() => setFocusedField(null)}
            variants={inputVariants}
            animate={focusedField === 'mobile' ? 'focused' : 'unfocused'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
            placeholder="Enter your mobile number"
          />
        </div>

        {/* Membership Plan Dropdown */}
        <div className="space-y-2">
          <label htmlFor="membershipPlan" className="block text-sm font-medium text-gray-700">
            <Shield className="w-4 h-4 inline mr-2" />
            Membership Plan
          </label>
          <motion.select
            id="membershipPlan"
            name="membershipPlan"
            required
            value={formData.membershipPlan}
            onChange={handleInputChange}
            onFocus={() => setFocusedField('membershipPlan')}
            onBlur={() => setFocusedField(null)}
            variants={inputVariants}
            animate={focusedField === 'membershipPlan' ? 'focused' : 'unfocused'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none bg-white"
          >
            {membershipPlans.map((plan) => (
              <option key={plan.value} value={plan.value} disabled={plan.value === ''}>
                {plan.label}
              </option>
            ))}
          </motion.select>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <motion.div 
            className="flex items-start space-x-3"
            whileTap={{ scale: 0.98 }}
          >
            <motion.input
              id="termsAccepted"
              name="termsAccepted"
              type="checkbox"
              required
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              whileFocus={{ scale: 1.1 }}
            />
            <label htmlFor="termsAccepted" className="text-sm text-gray-700 leading-relaxed">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                Privacy Policy
              </a>
            </label>
          </motion.div>
        </div>

        {/* Continue Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
        >
          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Processing...</span>
              </motion.div>
            ) : (
              <motion.div
                key="continue"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <Heart className="w-5 h-5" />
                <span>Continue</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100"
        >
          <p>By joining, you'll help us protect and care for animals in need.</p>
          <p className="mt-1">🐕 🐱 Together we make a difference!</p>
        </motion.div>
      </form>
    </motion.div>
  );
}