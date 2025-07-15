"use client";

import React, { Component, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { logError } from "@/utils/logger";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  logs: string[];
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, logs: [] };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, logs: [] };
  }

  async componentDidCatch(
    error: Error,
    errorInfo: React.ErrorInfo
  ): Promise<void> {
    const errorId = uuidv4(); // Tạo ID lỗi
    const timestamp = new Date().toISOString(); // Thời gian
    const errorName = error.name || "UnknownError"; // Tên lỗi
    const errorCause = error.message || "Không xác định"; // Nguyên nhân

    // Gọi logger để ghi log
    const result = await logError({
      errorId,
      timestamp,
      errorName,
      errorCause,
    });

    if (!result.success) {
      console.error("Failed to save log:", result.message);
    }

    console.error("Error caught in Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full border border-red-300">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              🚨 Đã có lỗi xảy ra!
            </h2>
            <p className="text-gray-700 mb-4">
              Vui lòng thử lại sau.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition duration-150"
            >
              OK
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
