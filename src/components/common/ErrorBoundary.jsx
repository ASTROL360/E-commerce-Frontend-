import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
          <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
          <p className="text-gray-500 mb-6">{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button
            onClick={this.handleRetry}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
