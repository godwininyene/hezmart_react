import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
                Sorry, the page you were looking for was not found.
            </h1>
            <Link
                to="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
            >
                Return to Home
            </Link>
        </div>
    );
}