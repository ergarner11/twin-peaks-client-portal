import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

import http from '../../services/httpService';

import PaymentMethodWidget from '../payment-method/paymentMethodWidget';

import ButtonPanel from '../common/buttonPanel';

import { formatDate, formatCurrency, formatPaymentMethod } from '../../util';

function ActivateContract({ contract, handleClose }) {
  let parsedPreview;

  try {
    parsedPreview = JSON.parse(contract.initial_setup_info);
  } catch (e) {
    parsedPreview = contract.initial_setup_info;
  }

  const endPointName = contract.isHealthPlan ? 'healthPlan' : 'paymentPlan';
  const hasSetUpFee = !contract.isHealthPlan;
  const { isMonthly, downPayment, monthlyPaymentInfo, initialPaymentInfo } = parsedPreview;

  const [paymentMethods, setPaymentMethods] = useState({
    recurring: { isStored: 'Y', isPreview: 'N' },
    inFull: { isStored: 'Y', isPreview: 'N' },
    downPayment: { isStored: 'Y', isPreview: 'N' },
    feePayment: { isStored: 'Y', isPreview: 'N' },
  });

  const [currentStep, setCurrentStep] = useState('planDetails');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handlePaymentMethodChange = paymentMethod => {
    const updatedPaymentMethods = { ...paymentMethods };

    if (currentStep === 'recurringPaymentMethod') {
      updatedPaymentMethods.recurring = paymentMethod;
    } else if (currentStep === 'inFullPaymentMethod') {
      updatedPaymentMethods.inFull = paymentMethod;
    } else if (currentStep === 'downPaymentMethod') {
      updatedPaymentMethods.downPayment = paymentMethod;
    } else if (currentStep === 'feePaymentMethod') {
      updatedPaymentMethods.feePayment = paymentMethod;
    }

    setPaymentMethods(updatedPaymentMethods);
  };

  const handleNext = async nextStep => {
    await http.post(`/${endPointName}/activate/validate/${currentStep}`, getParams());

    if (nextStep === 'preview') {
      await http.post(`/${endPointName}/activate/preview`, getParams());
    }

    setCurrentStep(nextStep);
    setErrorMessage('');
  };

  const handleBack = previousStep => {
    setErrorMessage('');
    setCurrentStep(previousStep);
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    await http.post(`/${endPointName}/activate`, getParams());
    navigate(0);
  };

  const getParams = () => {
    return {
      contractId: contract.id,
      contractTypeId: contract.contract_type_id,
      paymentMethods: paymentMethods,
    };
  };

  const overview = isFinalOverview => {
    return (
      <div className="background-white p-4 w-100">
        {contract.isHealthPlan && (
          <div className="form-control-read-only">
            <label className="mb-2" htmlFor="planType">
              Type of Health Plan:
            </label>
            <p id="planType">{parsedPreview.contractName}</p>
          </div>
        )}
        <div className="form-control-read-only mt-3">
          <label className="mb-2" htmlFor="contractDuration">
            Contract Duration:
          </label>
          <p id="contractDuration">
            {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
          </p>
        </div>
        {isMonthly && (
          <div className="form-control-read-only mt-3">
            <label className="mb-2" htmlFor="paymentOption">
              Automatic Monthly Payments:
            </label>
            <p>{formatCurrency(monthlyPaymentInfo.amount)}</p>
            {isFinalOverview && (
              <p id="paymentOption">{formatPaymentMethod(paymentMethods.recurring)}</p>
            )}
          </div>
        )}
        {downPayment && (
          <div className="form-control-read-only mt-3">
            <label className="mb-2" htmlFor="paymentOption">
              Down Payment:
            </label>
            {formatCurrency(initialPaymentInfo.items.find(t => t.key === 'DOWN_PAYMENT').amount)}
            {isFinalOverview && (
              <p id="paymentOption">{formatPaymentMethod(paymentMethods.downPayment)}</p>
            )}
          </div>
        )}
        {hasSetUpFee && (
          <div className="form-control-read-only mt-3">
            <label className="mb-2" htmlFor="paymentOption">
              Payment Plan Set-up Charge:
            </label>
            <p>
              {formatCurrency(initialPaymentInfo.items.find(t => t.key === 'SETUP_FEE').amount)}
            </p>
            {isFinalOverview && (
              <p id="paymentOption">{formatPaymentMethod(paymentMethods.feePayment)}</p>
            )}
          </div>
        )}
        {!isMonthly && (
          <div className="form-control-read-only mt-3">
            <label className="mb-2" htmlFor="paymentOption">
              Annual Payment:
            </label>
            <p>{formatCurrency(initialPaymentInfo.amount)}</p>
            {isFinalOverview && (
              <p id="paymentOption">{formatPaymentMethod(paymentMethods.inFull)}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal show={true} onHide={handleClose} centered>
      <form>
        {errorMessage && <p className="error">{errorMessage}</p>}

        {currentStep === 'planDetails' && (
          <React.Fragment>
            <h2 className="mb-4">
              {contract.isHealthPlan ? `${contract.name}'s Health Plan` : 'Payment Plan'}
            </h2>
            {overview(false)}
            <ButtonPanel
              primaryButtonText="Next"
              handleCancel={handleClose}
              handleSubmit={() =>
                handleNext(isMonthly ? 'recurringPaymentMethod' : 'inFullPaymentMethod')
              }
              handleErrorMessage={setErrorMessage}
            />
          </React.Fragment>
        )}

        {currentStep === 'recurringPaymentMethod' && (
          <React.Fragment>
            <h2>Monthly Payments:</h2>
            <p className="mt-1 mb-4 gray">{formatCurrency(monthlyPaymentInfo.amount)} per month</p>
            <PaymentMethodWidget
              clientId={contract.client_id}
              labelText={[
                <span key={0}>
                  Select <strong>automatic</strong> payment method:
                </span>,
              ]}
              displayStoredOnly={true}
              selectedPaymentMethod={paymentMethods.recurring}
              handleErrorMessage={setErrorMessage}
              handlePaymentMethodChange={handlePaymentMethodChange}
            />
            <ButtonPanel
              primaryButtonText="Next"
              handleCancel={handleClose}
              handleBack={() => handleBack('planDetails')}
              handleSubmit={() =>
                handleNext(
                  downPayment ? 'downPaymentMethod' : hasSetUpFee ? 'feePaymentMethod' : 'preview'
                )
              }
              handleErrorMessage={setErrorMessage}
              disabled={!paymentMethods.recurring.category}
            />
          </React.Fragment>
        )}

        {currentStep === 'inFullPaymentMethod' && (
          <React.Fragment>
            <h2>{contract.isHealthPlan ? 'Annual' : 'One-Time'} Payment:</h2>
            <p className="mt-1 mb-4 gray">
              {formatCurrency(initialPaymentInfo.amount)} (paid upon setup)
            </p>
            <PaymentMethodWidget
              clientId={contract.client_id}
              hideLabel={true}
              selectedPaymentMethod={paymentMethods.inFull}
              handleErrorMessage={setErrorMessage}
              handlePaymentMethodChange={handlePaymentMethodChange}
            />
            <ButtonPanel
              primaryButtonText="Next"
              handleCancel={handleClose}
              handleBack={() => handleBack('planDetails')}
              handleSubmit={() => handleNext('preview')}
              handleErrorMessage={setErrorMessage}
              disabled={!paymentMethods.inFull.category}
            />
          </React.Fragment>
        )}

        {currentStep === 'downPaymentMethod' && (
          <React.Fragment>
            <h2>Down Payment:</h2>
            <p className="mt-1 mb-4 gray">
              {formatCurrency(initialPaymentInfo.items.find(t => t.key === 'DOWN_PAYMENT').amount)}{' '}
              (paid upon setup)
            </p>
            <PaymentMethodWidget
              clientId={contract.client_id}
              hideLabel={true}
              selectedPaymentMethod={paymentMethods.downPayment}
              handleErrorMessage={setErrorMessage}
              handlePaymentMethodChange={handlePaymentMethodChange}
            />
            <ButtonPanel
              primaryButtonText="Next"
              handleCancel={handleClose}
              handleBack={() => handleBack('recurringPaymentMethod')}
              handleSubmit={() => handleNext(hasSetUpFee ? 'feePaymentMethod' : 'preview')}
              handleErrorMessage={setErrorMessage}
              disabled={!paymentMethods.downPayment.category}
            />
          </React.Fragment>
        )}

        {currentStep === 'feePaymentMethod' && (
          <React.Fragment>
            <h2>Payment Plan Set-up Charge:</h2>
            <p className="mt-1 mb-4 gray">
              {formatCurrency(initialPaymentInfo.items.find(t => t.key === 'SETUP_FEE').amount)}
            </p>
            <PaymentMethodWidget
              clientId={contract.client_id}
              hideLabel={true}
              selectedPaymentMethod={paymentMethods.feePayment}
              handleErrorMessage={setErrorMessage}
              handlePaymentMethodChange={handlePaymentMethodChange}
            />
            <ButtonPanel
              primaryButtonText="Next"
              handleCancel={handleClose}
              handleBack={() =>
                handleBack(downPayment ? 'downPaymentMethod' : 'recurringPaymentMethod')
              }
              handleSubmit={() => handleNext('preview')}
              handleErrorMessage={setErrorMessage}
              disabled={!paymentMethods.feePayment.category}
            />
          </React.Fragment>
        )}

        {currentStep === 'preview' && (
          <React.Fragment>
            <h2 className="mb-2">Summary</h2>
            {overview(true)}
            <ButtonPanel
              primaryButtonText="Activate Plan"
              handleCancel={handleClose}
              handleBack={() => {
                if (!isMonthly) {
                  handleBack('inFullPaymentMethod');
                } else {
                  handleBack(
                    hasSetUpFee
                      ? 'feePaymentMethod'
                      : downPayment
                      ? 'downPaymentMethod'
                      : 'recurringPaymentMethod'
                  );
                }
              }}
              handleSubmit={handleSubmit}
              handleErrorMessage={setErrorMessage}
            />
          </React.Fragment>
        )}
      </form>
    </Modal>
  );
}

export default ActivateContract;
