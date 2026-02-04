"use client";

import React, { FC } from "react";

const NotFound: FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center p-5">
      <h1 className="text-6xl mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-500">Requested page does not exist.</p>
    </div>
  );
};

export default NotFound;
