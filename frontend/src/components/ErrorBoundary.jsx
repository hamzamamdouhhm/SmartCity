import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button, Card } from "./ui";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-base">
          <Card className="max-w-md w-full text-center">
            <div className="w-12 h-12 rounded-full bg-danger-50 dark:bg-danger-50/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-danger-500" />
            </div>
            <h2 className="text-h3 font-display text-text-primary mb-2">
              {this.props.title || "Something went wrong"}
            </h2>
            <p className="text-body text-text-secondary mb-6">
              {this.props.description || "An unexpected error occurred. Please try again."}
            </p>
            <Button
              onClick={() => window.location.reload()}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Reload page
            </Button>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
