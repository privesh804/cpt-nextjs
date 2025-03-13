import React from "react";
import Link from "next/link";

const Unauthorized: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-red-600">403 - Unauthorized</h1>
        <p className="mt-4 text-sm text-gray-700 mb-4">
          You do not have permission to access this page.
        </p>
        <Link href="/" className="btn btn-lg btn-primary">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
