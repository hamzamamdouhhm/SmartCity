import React from "react";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper text-ink p-8">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-4">Smart City Benchmarking</h1>
        <p className="text-gray-600 mb-6">
          Das aktuelle Dashboard wird als eigenständige React-Anwendung vom Backend ausgeliefert.
        </p>
        <p className="text-gray-600 mb-6">
          Starten Sie das Backend mit <code className="bg-white px-2 py-1 rounded border">cd backend && python app.py</code> und öffnen Sie <a href="http://localhost:3001/" className="text-forest underline">http://localhost:3001/</a>.
        </p>
      </div>
    </div>
  );
}
