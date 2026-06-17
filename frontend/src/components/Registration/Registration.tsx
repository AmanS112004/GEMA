import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePopper } from 'react-popper';
import toast from 'react-hot-toast';
import { submitEnquiry } from '../../services/enquiry';
import { FiUser, FiMail, FiPhone, FiAlertCircle } from 'react-icons/fi';

// Zod validation schema
const registrationSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
  email: z.string().email({ message: 'Please provide a valid email address' }),
  phone: z.string().regex(/^[6-9]\d{9}$/, {
    message: 'Must be a valid 10-digit Indian phone number starting with 6-9',
  }),
});

type FormData = z.infer<typeof registrationSchema>;

export const Registration: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhoneTooltip, setShowPhoneTooltip] = useState(false);

  // Popper configuration for Phone Input field hint
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const loadingToastId = toast.loading('Submitting enquiry...');

    try {
      const result = await submitEnquiry(data);

      if (result.success) {
        toast.success(result.message || 'Registration submitted successfully!', {
          id: loadingToastId,
        });
        reset();
      } else {
        const errorMsg = result.errors?.[0]?.message || 'Failed to submit registration.';
        toast.error(errorMsg, { id: loadingToastId });
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred. Please try again.', {
        id: loadingToastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="register" className="py-24 bg-gradient-to-b from-[#F5F1E8] to-[#EAE4D5] px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white/70 backdrop-blur-md border border-white/60 p-8 sm:p-12 rounded-premium shadow-premium">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Application
          </span>
          <h2 className="text-3xl font-heading font-extrabold text-primary-dark mt-4">
            Enroll Your Child
          </h2>
          <p className="mt-2 text-dark-muted font-light text-sm sm:text-base">
            Fill in the details below. Our team will verify your entry and reach out to complete setup.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          
          {/* Name Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-primary-dark">
              Student / Parent Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-primary-light pointer-events-none">
                <FiUser size={18} />
              </span>
              <input
                id="name"
                type="text"
                {...register('name')}
                disabled={isSubmitting}
                className={`w-full bg-background/50 border ${
                  errors.name ? 'border-accent' : 'border-primary/20 focus:border-primary'
                } rounded-2xl pl-11 pr-4 py-4 text-dark placeholder-primary-light/50 transition-colors focus:outline-none`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <span className="text-xs text-accent flex items-center space-x-1 mt-1 font-medium">
                <FiAlertCircle className="flex-shrink-0" />
                <span>{errors.name.message}</span>
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-primary-dark">
              Parent Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-primary-light pointer-events-none">
                <FiMail size={18} />
              </span>
              <input
                id="email"
                type="email"
                {...register('email')}
                disabled={isSubmitting}
                className={`w-full bg-background/50 border ${
                  errors.email ? 'border-accent' : 'border-primary/20 focus:border-primary'
                } rounded-2xl pl-11 pr-4 py-4 text-dark placeholder-primary-light/50 transition-colors focus:outline-none`}
                placeholder="parent@example.com"
              />
            </div>
            {errors.email && (
              <span className="text-xs text-accent flex items-center space-x-1 mt-1 font-medium">
                <FiAlertCircle className="flex-shrink-0" />
                <span>{errors.email.message}</span>
              </span>
            )}
          </div>

          {/* Phone Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="phone" className="text-sm font-semibold text-primary-dark">
              Contact Phone Number
            </label>
            <div ref={setReferenceElement} className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-primary-light pointer-events-none">
                <FiPhone size={18} />
              </span>
              <input
                id="phone"
                type="tel"
                {...register('phone')}
                disabled={isSubmitting}
                onFocus={() => setShowPhoneTooltip(true)}
                onBlur={() => setShowPhoneTooltip(false)}
                className={`w-full bg-background/50 border ${
                  errors.phone ? 'border-accent' : 'border-primary/20 focus:border-primary'
                } rounded-2xl pl-11 pr-4 py-4 text-dark placeholder-primary-light/50 transition-colors focus:outline-none`}
                placeholder="9876543210"
              />
            </div>
            {errors.phone && (
              <span className="text-xs text-accent flex items-center space-x-1 mt-1 font-medium">
                <FiAlertCircle className="flex-shrink-0" />
                <span>{errors.phone.message}</span>
              </span>
            )}
          </div>

          {/* Popper Tooltip for Phone Number */}
          {showPhoneTooltip && (
            <div
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
              className="z-30 bg-primary text-secondary text-xs font-semibold py-2.5 px-4 rounded-xl shadow-lg border border-primary-light/20 max-w-[250px] text-center"
            >
              Please enter a 10-digit Indian mobile number (e.g., 9876543210).
              <div className="bg-primary w-2 h-2 absolute left-1/2 transform -translate-x-1/2 -bottom-1 rotate-45 border-r border-b border-primary-light/20" />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full py-4 px-6 rounded-premium font-heading font-semibold text-base shadow-premium transition-all duration-300 ${
              !isValid || isSubmitting
                ? 'bg-primary/40 text-secondary/60 cursor-not-allowed'
                : 'bg-primary text-secondary hover:bg-primary-dark hover:shadow-premium-hover cursor-pointer'
            } flex items-center justify-center space-x-2`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-secondary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Registering...</span>
              </>
            ) : (
              <span>Confirm Registration</span>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
