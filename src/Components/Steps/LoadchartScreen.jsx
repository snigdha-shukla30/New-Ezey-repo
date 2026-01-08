import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { CardContainer } from './CardContainer';
import { Button } from '../../Components/ui/Button';
import { Footer } from './Footer';

export const LoadchartScreen = ({ onNext }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <CardContainer title="Ready to upload the loadchart? We'll extract faculty assignments and class loads for scheduling">
      <div className="max-w-md mx-auto">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 bg-white'
          }`}
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-24 bg-blue-400 rounded-lg shadow-md flex items-center justify-center">
                <div className="w-16 h-3 bg-white rounded-sm mb-2"></div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-24 h-20 bg-teal-500 rounded-lg shadow-md flex items-center justify-center">
                <div className="w-12 h-2 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>

          <p className="text-gray-600 font-medium mb-6 text-base">
            Drag and drop loadset file to upload
          </p>
          <Button variant="secondary" className="w-60 mx-auto">
            Browse File
          </Button>
        </div>
      </div>

      <Button onClick={onNext} className="mt-8 bg-teal-600 hover:bg-teal-700">
        Upload Loadchart
      </Button>

      <Footer />
    </CardContainer>
  );
};









