import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorHandler extends Component<Props, State> {
  public readonly props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
  }
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Global Application Error:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 bg-rose-500/20 text-rose-400 rounded-full mb-4">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-black mb-2">সিস্টেম ত্রুটি পরিলক্ষিত হয়েছে</h1>
          <p className="text-xs text-slate-400 max-w-md mb-6">
            {this.state.error?.message || 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'}
          </p>
          <button
            onClick={this.handleReload}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>সিস্টেম রিলোড করুন</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
