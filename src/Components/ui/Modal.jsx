/**
 * Modal/Alert Component for Ezey Project
 * Location: src/components/ui/Modal.jsx
 * 
 * Replaces alert() boxes with styled modals
 */

import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info', // 'success', 'error', 'warning', 'info'
  showCloseButton = true,
  children,
  actions,
}) => {
  if (!isOpen) return null;

  const iconMap = {
    success: <CheckCircle className="w-12 h-12 text-green-500" />,
    error: <AlertCircle className="w-12 h-12 text-red-500" />,
    warning: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
    info: <Info className="w-12 h-12 text-blue-500" />,
  };

  const colorMap = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="modal-container">
        <div className="modal-content">
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Icon */}
            <div className="flex justify-center mb-4">
              {iconMap[type]}
            </div>

            {/* Title */}
            {title && (
              <h3 
                className={`text-xl font-semibold text-center ${colorMap[type]}`}
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {title}
              </h3>
            )}
          </div>

          {/* Body */}
          <div className="px-6 pb-4">
            {message && (
              <p className="text-center text-gray-600 text-sm mb-4">
                {message}
              </p>
            )}
            {children}
          </div>

          {/* Actions */}
          {actions && (
            <div className="px-6 pb-6 flex justify-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/**
 * Confirmation Modal Component
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      message={message}
      type={type}
      showCloseButton={false}
      actions={
        <>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2 rounded-md text-white font-medium transition-colors"
            style={{
              background: 'linear-gradient(0deg, #265768 0%, #4BACCE 100%)',
            }}
          >
            {confirmText}
          </button>
        </>
      }
    />
  );
};

/**
 * Alert Modal Component (replaces window.alert)
 */
export const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttonText = 'OK',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      message={message}
      type={type}
      actions={
        <button
          onClick={onClose}
          className="px-8 py-2 rounded-md text-white font-medium transition-colors"
          style={{
            background: 'linear-gradient(0deg, #265768 0%, #4BACCE 100%)',
          }}
        >
          {buttonText}
        </button>
      }
    />
  );
};

/**
 * Custom Hook for Alert Modal
 */
export const useAlert = () => {
  const [alertState, setAlertState] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showAlert = ({ title, message, type = 'info' }) => {
    setAlertState({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };

  const AlertComponent = () => (
    <AlertModal
      isOpen={alertState.isOpen}
      onClose={closeAlert}
      title={alertState.title}
      message={alertState.message}
      type={alertState.type}
    />
  );

  return {
    showAlert,
    AlertComponent,
  };
};

/**
 * Custom Hook for Confirm Modal
 */
export const useConfirm = () => {
  const [confirmState, setConfirmState] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => {},
  });

  const showConfirm = ({ title, message, type = 'warning', onConfirm }) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
    });
  };

  const closeConfirm = () => {
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  };

  const ConfirmComponent = () => (
    <ConfirmModal
      isOpen={confirmState.isOpen}
      onClose={closeConfirm}
      onConfirm={confirmState.onConfirm}
      title={confirmState.title}
      message={confirmState.message}
      type={confirmState.type}
    />
  );

  return {
    showConfirm,
    ConfirmComponent,
  };
};

export default Modal;
