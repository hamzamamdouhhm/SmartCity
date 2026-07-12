import React from "react";
import { Card } from "./Card";

const AuthFormCard = ({ title, children, footer }) => (
  <div className="max-w-md mx-auto mt-10">
    <Card padding="auth">
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 rounded-xl premium-gradient flex items-center justify-center text-text-inverse font-bold text-lg shadow-sm">
          SCB
        </div>
      </div>
      <h1 className="text-h2 font-display text-center text-text-primary mb-6">{title}</h1>
      {children}
    </Card>
    <div className="text-center mt-4 text-sm text-text-secondary">{footer}</div>
  </div>
);

export default AuthFormCard;
