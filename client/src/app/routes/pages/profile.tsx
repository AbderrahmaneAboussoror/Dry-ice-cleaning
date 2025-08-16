import PersonalInformation from "@/features/profile/components/personal-informations";
import Appointments from "@/features/profile/components/appointments";
import JobHistory from "@/features/profile/components/job-history";
import PurchasedPacks from "@/features/profile/components/purchased-packs";
import BaseLayout from "@/components/layouts/base-layout";

const Profile = () => {
  return (
    <BaseLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Manage your account information and view your service history
          </p>
        </div>

        <PersonalInformation />
        <Appointments />
        <JobHistory />
        <PurchasedPacks />
      </div>
    </BaseLayout>
  );
};

export default Profile;
