import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineArrowLeft } from "react-icons/ai";

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-lg text-center">
        <div className="text-accent mb-8 text-8xl font-light tracking-tight">
          404
        </div>

        <h1 className="mb-4 text-3xl font-medium tracking-tight text-gray-900">
          Page not found
        </h1>

        <p className="mx-auto mb-12 max-w-md text-lg leading-relaxed text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={handleGoHome}
            className="bg-accent inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-pink-400"
          >
            <AiOutlineHome className="h-5 w-5" />
            Go home
          </button>

          <button
            onClick={handleGoBack}
            className="border-accent text-accent inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border px-6 py-3 font-medium transition-colors duration-200 hover:bg-gray-50"
          >
            <AiOutlineArrowLeft className="h-5 w-5" />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;