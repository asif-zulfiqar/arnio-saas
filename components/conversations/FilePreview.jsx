"use client";
import { File, Image as ImageIcon, Trash2, RotateCcw, AlertCircle } from "lucide-react";
import { useState } from "react";

const FilePreview = ({ 
  upload, 
  onRemove, 
  onRetry, 
  onSend 
}) => {

  const getFileIcon = (type, name) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4 text-gray-500" />;
    }
    
    // Check file extension for more specific icons
    const extension = name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <File className="w-4 h-4 text-gray-500" />;
      case 'doc':
      case 'docx':
        return <File className="w-4 h-4 text-gray-500" />;
      case 'xls':
      case 'xlsx':
        return <File className="w-4 h-4 text-gray-500" />;
      case 'ppt':
      case 'pptx':
        return <File className="w-4 h-4 text-gray-500" />;
      case 'txt':
        return <File className="w-4 h-4 text-gray-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const truncateFileName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 4);
    return `${truncatedName}...${extension}`;
  };

  return (
    <div
      className={`relative bg-gray-50 rounded-lg p-4 transition-all duration-200 max-w-[350px]`}
    >
      <div className="flex items-center gap-3">
        {/* Circular Progress Indicator or File Icon */}
        <div className="flex-shrink-0">
          {upload.status === "uploading" ? (
            <div className="relative w-6 h-6">
              <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#1C64F2"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 10}`}
                  strokeDashoffset={`${2 * Math.PI * 10 * (1 - upload.progress / 100)}`}
                  className="transition-all duration-300 ease-in-out"
                />
              </svg>
            </div>
          ) : (
            getFileIcon(upload.type, upload.name)
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {truncateFileName(upload.name)}
            </p>
          </div>

          {/* Status */}
          {upload.status === "error" && (
            <div className="mt-1 flex items-center gap-2">
              <AlertCircle className="w-3 h-3 text-red-500" />
              <span className="text-xs text-red-600">{upload.error}</span>
            </div>
          )}

          {upload.status === "success" && (
              <span className="text-xs text-green-600">Ready to send</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {upload.status === "error" && (
            <button
              onClick={() => onRetry(upload.id)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Retry upload"
            >
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>
          )}
          
          <button
            onClick={() => onRemove(upload.id)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Remove file"
          >
            <Trash2 className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
