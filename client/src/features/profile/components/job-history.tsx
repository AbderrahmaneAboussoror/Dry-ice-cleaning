import Check from "@/components/icons/check";
import Return from "@/components/icons/return";
import { useState, useEffect } from "react";
import { userService, type Appointment } from "@/services/userService";

// Helper function to format date
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function to format service type
const formatServiceType = (serviceType: 'basic' | 'deluxe') => {
  return serviceType === 'basic' ? 'Basic Cleaning Service' : 'Deluxe Cleaning Service';
};

const JobHistory = () => {
  const [jobs, setJobs] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobHistory();
  }, []);

  const loadJobHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { appointments } = await userService.getBookings();
      setJobs(appointments);
    } catch (error: any) {
      console.error('Error loading job history:', error);
      setError(error.message || 'Failed to load job history');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
        <section className="bg-white p-6 rounded-lg space-y-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_3px_3px_rgba(0,0,0,0.1)]">
          <div className="animate-pulse">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <div className="flex items-center space-x-5">
                      <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-48"></div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>
    );
  }

  return (
      <section className="bg-white p-6 rounded-lg space-y-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_3px_3px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Return size="18" color="#26687D" />
            <span className="text-lg text-gray-800 font-semibold capitalize">
            Job History
          </span>
          </div>
          {!isLoading && (
              <button
                  onClick={loadJobHistory}
                  className="text-cyan hover:text-cyan-600 text-sm font-medium"
              >
                Refresh
              </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                  onClick={loadJobHistory}
                  className="text-red-600 hover:text-red-800 underline ml-4"
              >
                Retry
              </button>
            </div>
        )}

        {/* No Jobs Message */}
        {!error && jobs.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Return size="24" color="#9CA3AF" />
              </div>
              <p className="text-gray-500">No completed jobs yet</p>
              <p className="text-gray-400 text-sm mt-1">Your completed appointments will appear here</p>
            </div>
        )}

        {/* Job History List */}
        {jobs.length > 0 && (
            <div className="space-y-3">
              {jobs.map((job) => {
                const points = job.price;
                return (
                    <div
                        key={job._id}
                        className="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-5">
                        <div className="w-10 h-10 bg-cyan rounded-md flex items-center justify-center flex-shrink-0">
                          <Check size="18" color="black" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-gray-900">
                            {formatServiceType(job.serviceType)}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(job.appointmentDate)} • {job.location}
                          </p>
                          {job.timeSlot && (
                              <p className="text-xs text-gray-500">
                                {job.timeSlot}
                              </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-gray-900">
                          {points} points
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          {job.status}
                        </p>
                      </div>
                    </div>
                );
              })}
            </div>
        )}

        {/* Summary Stats */}
        {jobs.length > 0 && (
            <div className="border-t border-gray-200 pt-4 mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                  <p className="text-sm text-gray-600">Total Jobs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan">
                    {jobs.reduce((total, job) => total + job.price, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Points Consumed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {jobs.filter(job => job.serviceType === 'deluxe').length}
                  </p>
                  <p className="text-sm text-gray-600">Premium Jobs</p>
                </div>
              </div>
            </div>
        )}
      </section>
  );
};

export default JobHistory;