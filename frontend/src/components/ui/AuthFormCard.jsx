import React from "react";

const AuthFormCard = ({ title, children, footer }) => (
  <div className="max-w-md mx-auto mt-10">
    <div className="bg-white rounded-2xl p-8 card-shadow border border-gray-100">
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 rounded-xl premium-gradient flex items-center justify-center text-white font-bold text-lg">SCB</div>
      </div>
      <h1 className="text-2xl font-bold text-center text-ink mb-6">{title}</h1>
      {children}
    </div>
    <div className="text-center mt-4 text-sm">{footer}</div>
  </div>
);

export default AuthFormCard;
