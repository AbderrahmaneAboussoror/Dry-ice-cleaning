import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calender from "@/components/icons/calender";
import Ssd from "@/components/icons/ssd";
import Location from "@/components/icons/location";
import CustomSelect from "@/components/ui/select";
import FloatingInput from "@/components/ui/floating-input";
import FloatingTextarea from "@/components/ui/floating-textarea";
import { appointmentService } from "@/services/appointmentService";
import { authService } from "@/services/authService";
import paths from "@/config/paths";
import {useModal} from "@/hooks/useModal";
import {ConfirmationModal} from "@/components/ui/confirmation-modal";
import {SuccessModal} from "@/components/ui/success-modal";

interface OptionType {
  value: string;
  label: string;
}

interface ValidationErrors {
  service?: string;
  date?: string;
  location?: string;
  notes?: string;
}

const BookAppointment = () => {
  const navigate = useNavigate();
  const authModal = useModal();
  const successModal = useModal();
  const errorModal = useModal();
  const [selectedService, setSelectedService] = useState<OptionType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Updated service options to match backend enum ('basic' | 'deluxe')
  const serviceOptions: OptionType[] = [
    { value: "basic", label: "Basic Cleaning Service" },
    { value: "deluxe", label: "Deluxe Cleaning Service" },
  ];

  // Service pricing (you can adjust these values or fetch from API)
  const servicePricing = {
    basic: {
      basePrice: 1000,
      description: "50% extra on the weekend and 100% extra on holiday"
    },
    deluxe: {
      basePrice: 1500,
      description: "50% extra on the weekend and 100% extra on holiday"
    }
  };

  // Helper function to get service price and info
  const getServiceInfo = (serviceType: string) => {
    return servicePricing[serviceType as keyof typeof servicePricing];
  };

  // Helper function to get minimum date (tomorrow)
  const getMinDate = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Helper function to get maximum date (3 months from now)
  const getMaxDate = (): string => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  // Clear specific field error when user starts typing/selecting
  const clearFieldError = (field: keyof ValidationErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Service validation
    if (!selectedService) {
      newErrors.service = "Please select a service type";
    }

    // Date validation
    if (!selectedDate) {
      newErrors.date = "Please select an appointment date";
    } else {
      const selectedDateObj = new Date(selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDateObj < today) {
        newErrors.date = "Please select a future date";
      }
    }

    // Location validation
    if (!location.trim()) {
      newErrors.location = "Please enter your service location";
    } else if (location.trim().length < 5) {
      newErrors.location = "Location address must be at least 5 characters long";
    } else if (location.trim().length > 200) {
      newErrors.location = "Location address must be less than 200 characters";
    }

    // Notes validation
    if (notes.length > 500) {
      newErrors.notes = "Notes cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Authentication check with popup
  const checkAuthentication = async (): Promise<boolean> => {
    if (!authService.isAuthenticated()) {
      authModal.openModal();
      return false;
    }
    return true;
  };

  const handleAuthConfirm = () => {
    authModal.closeModal();
    navigate(paths.login.path);
  };


  const handleConfirmAppointment = async () => {
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
      return;
    }

    setErrors({});
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const appointmentData = {
        serviceType: selectedService!.value as 'basic' | 'deluxe',
        appointmentDate: selectedDate,
        location: location.trim(),
        ...(notes.trim() && { notes: notes.trim() })
      };

      const result = await appointmentService.bookAppointment(appointmentData);

      const currentUser = authService.getCurrentUser();
      if (currentUser && result.userPointsRemaining !== undefined) {
        const updatedUser = {
          ...currentUser,
          totalPoints: result.userPointsRemaining
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // Set success data and show modal
      setSuccessData({
        service: result.appointment.serviceType === 'basic' ? 'Basic Cleaning' : 'Deluxe Cleaning',
        date: new Date(result.appointment.appointmentDate).toLocaleDateString(),
        time: result.appointment.timeSlot,
        location: result.appointment.location,
        pointsRemaining: result.userPointsRemaining
      });

      successModal.openModal();

      // Reset form
      setSelectedService(null);
      setSelectedDate("");
      setLocation("");
      setNotes("");
      setErrors({});

    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred while booking your appointment. Please try again.');
      errorModal.openModal();
      console.error("Booking error:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
      <>
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-10 px-5">
          <p className="text-4xl font-semibold capitalize">book your appointment</p>

          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Service Selection */}
              <div className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-5 py-3">
                <Ssd size="25" />
                <div className="flex flex-col items-start justify-center min-w-0 flex-1">
                  <p className="text-sm capitalize mb-1">select service *</p>
                  <CustomSelect
                      options={serviceOptions}
                      placeholder="Choose service"
                      value={selectedService}
                      onChange={(value) => {
                        setSelectedService(value);
                        clearFieldError('service');
                      }}
                  />
                  {errors.service && (
                      <p className="text-red-500 text-xs mt-1">{errors.service}</p>
                  )}
                  {!errors.service && selectedService && (
                      <div className="mt-1">
                        <p className="text-green-600 text-xs font-medium">
                          💰 Price: {getServiceInfo(selectedService.value).basePrice} points
                        </p>
                        <p className="text-gray-500 text-xs">
                          {getServiceInfo(selectedService.value).description}
                        </p>
                      </div>
                  )}
                </div>
              </div>

              {/* Date Selection - Now using HTML5 date input */}
              <div className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-5 py-3">
                <Calender size="25" />
                <div className="flex flex-col items-start justify-center min-w-0 flex-1">
                  <p className="text-sm capitalize mb-1">select date *</p>
                  <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        clearFieldError('date');
                      }}
                      min={getMinDate()}
                      max={getMaxDate()}
                      className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#26687D] focus:border-transparent ${
                          errors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.date && (
                      <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                  )}
                  {!errors.date && (
                      <p className="text-xs text-gray-500 mt-1">
                        Available: tomorrow to 3 months ahead
                      </p>
                  )}
                </div>
              </div>

              {/* Location Input - Now spans 2 columns on large screens */}
              <div className="lg:col-span-2 flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-5 py-3">
                <Location size="25" />
                <div className="flex flex-col items-start justify-center min-w-0 flex-1">
                  <p className="text-sm capitalize mb-1">service location *</p>
                  <FloatingInput
                      id="location"
                      label="Enter your full address"
                      type="text"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        clearFieldError('location');
                      }}
                  />
                  {errors.location && (
                      <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                  )}
                  {!errors.location && (
                      <p className="text-xs text-gray-500 mt-1">
                        Our team will come to this address (5-200 characters)
                      </p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes Section - Full width */}
            <div className="mt-5 border border-gray-300 rounded-lg px-5 py-3">
              <div className="flex flex-col items-start justify-center">
                <p className="text-sm capitalize mb-1">additional notes (optional)</p>
                <FloatingTextarea
                    id="notes"
                    label="Any special instructions or requests"
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      clearFieldError('notes');
                    }}
                />
                {errors.notes && (
                    <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
                )}
                <p className={`text-xs mt-1 ${
                    notes.length > 450 ? 'text-orange-500' :
                        notes.length > 500 ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {notes.length}/500 characters
                </p>
              </div>
            </div>

            {/* Book Button */}
            <div className="mt-5 flex justify-center">
              <button
                  onClick={handleConfirmAppointment}
                  disabled={isLoading}
                  className={`px-8 py-3 text-white rounded-md capitalize text-sm transition-colors min-w-[200px] ${
                      isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#26687D] hover:bg-[#1e5a6b]'
                  }`}
              >
                {isLoading ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>

            {/* Information Text */}
            <div className="mt-5 text-center text-sm text-gray-600">
              <p>* Required fields</p>
              <p className="mt-1">Our mobile team will come to your specified location</p>
            </div>
          </div>
        </div>

        <ConfirmationModal
            isOpen={authModal.isOpen}
            onClose={authModal.closeModal}
            onConfirm={handleAuthConfirm}
            title="Sign In Required"
            message="You need to sign in to book an appointment with us. Create an account or sign in to continue with your booking."
            confirmText="Sign In"
            cancelText="Cancel"
            type="info"
            icon={
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
        />

        {/* Success Modal */}
        <SuccessModal
            isOpen={successModal.isOpen}
            onClose={successModal.closeModal}
            title="Appointment Booked Successfully!"
            details={successData ? [
              { label: 'Service', value: successData.service },
              { label: 'Date', value: successData.date },
              { label: 'Time', value: successData.time },
              { label: 'Location', value: successData.location },
              { label: 'Points Remaining', value: successData.pointsRemaining.toString() }
            ] : []}
        />

        <ConfirmationModal
            isOpen={errorModal.isOpen}
            onClose={errorModal.closeModal}
            onConfirm={errorModal.closeModal}
            title="Booking Failed"
            message={errorMessage}
            confirmText="Try Again"
            cancelText="Cancel"
            type="error"
        />
      </>
  );
};

export default BookAppointment;