import React from "react";
import { AlertCircle } from "lucide-react";

export const FirebaseNotConfigured: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-red-500">
          <AlertCircle className="h-12 w-12" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Firebase Not Configured
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please configure your Firebase environment variables to use this application.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              You need to provide the following environment variables in your AI Studio Secrets panel or <code>.env</code> file:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 font-mono bg-gray-50 p-4 rounded-md border border-gray-200">
              <li>VITE_FIREBASE_API_KEY</li>
              <li>VITE_FIREBASE_AUTH_DOMAIN</li>
              <li>VITE_FIREBASE_PROJECT_ID</li>
              <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
              <li>VITE_FIREBASE_APP_ID</li>
            </ul>
            <p className="text-sm text-gray-700 mt-4">
              Once configured, the application will automatically connect to your Firebase project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
