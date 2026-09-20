import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
    this.handleReset = this.handleReset.bind(this);
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public handleReset() {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-3xl text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 font-heading mb-2">
            {this.props.fallbackTitle || 'Component Render Failed'}
          </h2>
          <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
            An unexpected runtime error occurred while loading this module. You can try refreshing this view or navigating back to the dashboard.
          </p>

          {this.state.error && (
            <div className="bg-slate-900 text-red-300 p-4 rounded-xl text-xs font-mono text-left max-w-lg w-full mb-6 overflow-x-auto border border-slate-800">
              <span className="font-bold text-white block mb-1">Error Message:</span>
              {this.state.error.message || String(this.state.error)}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} /> Retry Component
            </button>
            <a
              href="/admin"
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              <Home size={14} /> Back to Dashboard
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
