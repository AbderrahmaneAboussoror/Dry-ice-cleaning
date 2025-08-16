import AdminLayout from "../../../../features/admin/components/admin-layout";

const AdminPacks = () => {
    return (
        <AdminLayout>
            <div className="flex items-center justify-center h-96">
                <div className="text-center space-y-4">
                    {/* Icon */}
                    <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        </svg>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900">
                        Service Packs Management
                    </h1>

                    {/* Message */}
                    <p className="text-lg text-gray-600 max-w-md">
                        This feature is coming soon! Pack management functionality will be available in a future update.
                    </p>

                    {/* Additional info */}
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-700">
                            <span className="font-medium">Coming features:</span> Create, edit, and manage service packs, pricing tiers, and point allocations.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminPacks;