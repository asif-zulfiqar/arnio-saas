"use client";
import { File, Image as ImageIcon, Download, Eye } from "lucide-react";
import { useState } from "react";

const FileMessage = ({ message, isUser }) => {
  const [imageError, setImageError] = useState(false);

  const getFileIcon = (type, name) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5 text-white" />;
    }
    
    const extension = name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <File className="w-5 h-5 text-white" />;
      case 'doc':
      case 'docx':
        return <File className="w-5 h-5 text-white" />;
      case 'xls':
      case 'xlsx':
        return <File className="w-5 h-5 text-white" />;
      case 'ppt':
      case 'pptx':
        return <File className="w-5 h-5 text-white" />;
      case 'txt':
        return <File className="w-5 h-5 text-white" />;
      default:
        return <File className="w-5 h-5 text-white" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (message.fileUrl) {
      const link = document.createElement('a');
      link.href = message.fileUrl;
      link.download = message.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePreview = () => {
    if (message.fileUrl) {
      window.open(message.fileUrl, '_blank');
    }
  };

  const isImage = message.fileType?.startsWith('image/');

  return (
    <div className={`max-w-xs lg:max-w-md ${isUser ? 'ml-auto' : ''}`}>
      {/* File Content */}
      <div className={`rounded-[20px] p-4 ${
        isUser 
          ? 'bg-primary text-white' 
          : 'bg-gray-100 text-gray-900'
      }`}>
        
        {/* Image Preview */}
        {isImage && !imageError && (
          <div className="mb-3">
            <img
              src={message.fileUrl}
              alt={message.fileName}
              className="w-full h-32 object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {/* File Info */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {getFileIcon(message.fileType, message.fileName)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${
              isUser ? 'text-white' : 'text-gray-900'
            }`}>
              {message.fileName}
            </p>
            <p className={`text-xs ${
              isUser ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {formatFileSize(message.fileSize)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePreview}
              className={`p-1 rounded transition-colors ${
                isUser 
                  ? 'hover:bg-blue-600 text-blue-100' 
                  : 'hover:bg-gray-200 text-gray-600'
              }`}
              title="Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDownload}
              className={`p-1 rounded transition-colors ${
                isUser 
                  ? 'hover:bg-blue-600 text-blue-100' 
                  : 'hover:bg-gray-200 text-gray-600'
              }`}
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Text Content (if any) */}
        {message.content && (
          <div className="mt-3 pt-3 border-t border-opacity-80 border-current">
            <p className="text-sm">{message.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileMessage;