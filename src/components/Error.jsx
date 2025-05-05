import React from "react";
import { useRouteError } from "react-router-dom";

export default function Error() {
    const error = useRouteError();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
                <div className="text-6xl font-bold text-red-600 mb-4">Oops!</div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                    Something went wrong.
                </h1>
                <p className="text-gray-600 mb-6">
                    We apologize for the inconvenience. Here's what we know:
                </p>
                <div className="bg-red-50 p-4 rounded-lg text-left">
                    <p className="text-red-700 font-medium">
                        <span className="font-bold">Error:</span> {error.message}
                    </p>
                    <p className="text-red-700 mt-2">
                        <span className="font-bold">Status:</span> {error.status} - {error.statusText}
                    </p>
                </div>
                <a
                    href="/"
                    className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Go Back Home
                </a>
            </div>
        </div>
    );
}