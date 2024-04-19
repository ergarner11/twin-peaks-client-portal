import React, { useState } from 'react';

import { Mobile, NotMobile } from './responsive';

function ButtonPanel({
  primaryButtonText,
  secondaryButtonText,
  handleSubmit,
  turnOffProcessing,
  handleBack,
  handleCancel,
  handleErrorMessage,
  disabled,
  className,
  primaryIsError,
}) {
  const primaryButtonClass = primaryIsError ? 'btn-filled-error' : 'btn-filled-primary';
  const [isProcessing, setIsProcessing] = useState(false);

  const processRequest = async () => {
    setIsProcessing(true);
    try {
      await handleSubmit();
      if (turnOffProcessing) {
        setIsProcessing(false);
      }
    } catch (error) {
      handleErrorMessage(error.response.data.message);
      setIsProcessing(false);
    }
  };

  return (
    <React.Fragment>
      <Mobile>
        <div className={`d-flex flex-column justify-content-center w-100 mt-5 ${className}`}>
          <button
            className={primaryButtonClass}
            type="button"
            onClick={processRequest}
            disabled={disabled || isProcessing}
          >
            {isProcessing && <i className="fa fa-circle-notch fa-spin" />}
            {primaryButtonText}
          </button>
          {handleBack && (
            <button
              className="btn-filled-secondary justify-content-center mt-3"
              type="button"
              onClick={handleBack}
            >
              Back
            </button>
          )}
          <button
            className="btn-text-secondary justify-content-center my-3"
            type="button"
            onClick={handleCancel}
          >
            {secondaryButtonText ? secondaryButtonText : 'Cancel'}
          </button>
        </div>
      </Mobile>
      <NotMobile>
        <div
          className={`flex-row-aligned ${
            handleBack ? 'justify-content-between w-100' : 'align-self-end'
          } mt-5 ${className}`}
        >
          <div className="flex-row-aligned">
            <button className="btn-text-secondary" type="button" onClick={handleCancel}>
              {secondaryButtonText ? secondaryButtonText : 'Cancel'}
            </button>
            {handleBack && (
              <button className="btn-filled-secondary ms-4" type="button" onClick={handleBack}>
                Back
              </button>
            )}
          </div>
          <button
            className={`${primaryButtonClass} ms-4`}
            type="button"
            onClick={processRequest}
            disabled={disabled || isProcessing}
          >
            {isProcessing && <i className="fa fa-circle-notch fa-spin" />}
            {primaryButtonText}
          </button>
        </div>
      </NotMobile>
    </React.Fragment>
  );
}

export default ButtonPanel;
