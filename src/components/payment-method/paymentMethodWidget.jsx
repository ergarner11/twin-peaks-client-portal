import React, { useState, useEffect } from 'react';

import http from '../../services/httpService';

import NewPaymentMethod from './newPaymentMethod';
import DetachPaymentMethod from './detachPaymentMethod';
import EditPaymentMethod from './editPaymentMethod';
import PaymentMethodMaster from './paymentMethodMaster';
import PaymentMethodSelector from './paymentMethodSelector';

import '../../styles/components/payment-method.scss';

function PaymentMethodWidget({
  clientId,
  selectedPaymentMethod,
  hideLabel,
  labelText,
  displayStoredOnly,
  masterCopy,
  handleErrorMessage,
  handlePaymentMethodChange,
}) {
  const [client, setClient] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(
    selectedPaymentMethod ? selectedPaymentMethod : { id: '', isStored: 'Y', isPreview: 'N' }
  );

  const [paymentMethodForModal, setPaymentMethodForModal] = useState(null);
  const [showDetachConfirmation, setShowDetachConfirmation] = useState(false);
  const [showEditPaymentMethod, setShowEditPaymentMethod] = useState(false);
  const [showNewPaymentMethod, setShowNewPaymentMethod] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const getPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const response = await http.get(`/client/getPaymentMethods?client_id=${clientId}`);
      const updatedPaymentMethods = response.data;

      if (updatedPaymentMethods) {
        updatedPaymentMethods.map(t => {
          t.isStored = 'Y';
          t.isPreview = 'N';
          return t;
        });

        const defaultPaymentMethod = updatedPaymentMethods.find(
          t => t.defaultPaymentMethod === 'Y'
        );

        if (defaultPaymentMethod) {
          updatePaymentMethod(defaultPaymentMethod);
        }
      }

      setPaymentMethods(updatedPaymentMethods);
      setIsLoading(false);
      return updatedPaymentMethods;
    } catch (error) {
      handleErrorMessage(error.response.data.message);
      setIsLoading(false);
    }
  };

  const refreshPaymentMethods = async paymentMethodId => {
    setShowNewPaymentMethod(false);
    setShowDetachConfirmation(false);
    setShowEditPaymentMethod(false);

    const updatePaymentMethods = await getPaymentMethods();
    if (updatePaymentMethods) {
      const selectedPaymentMethod = updatePaymentMethods.find(t => t.id === paymentMethodId);

      if (selectedPaymentMethod && !masterCopy) {
        updatePaymentMethod(selectedPaymentMethod);
      }
    }
  };

  useEffect(() => {
    refreshPaymentMethods(paymentMethod.id);
    const getClient = async () => {
      try {
        setIsLoading(true);
        const { data: client } = await http.get(`/client/getById?client_id=${clientId}`);
        setClient(client);
      } catch (error) {
        handleErrorMessage(error.response.data.message);
      }
      setIsLoading(false);
    };
    getClient();
  }, [clientId]);

  const updatePaymentMethod = paymentMethod => {
    setPaymentMethod(paymentMethod);
    handlePaymentMethodChange(paymentMethod);
  };

  return (
    <div className="payment-method-widget" style={{ width: masterCopy ? 'auto' : '' }}>
      {isLoading && <i className="flex-centered m-5 fa fa-circle-notch fa-spin fa-2x subtle" />}
      {!isLoading && masterCopy && (
        <PaymentMethodMaster
          paymentMethods={paymentMethods}
          handleEdit={paymentMethod => {
            setShowEditPaymentMethod(true);
            setPaymentMethodForModal(paymentMethod);
          }}
          handleDelete={paymentMethod => {
            setShowDetachConfirmation(true);
            setPaymentMethodForModal(paymentMethod);
          }}
          handleAddNewPaymentMethod={() => {
            updatePaymentMethod({ isStored: 'Y', isPreview: 'N' });
            setShowNewPaymentMethod(true);
          }}
        />
      )}
      {!isLoading && !masterCopy && (
        <PaymentMethodSelector
          hideLabel={hideLabel}
          labelText={labelText}
          displayStoredOnly={displayStoredOnly}
          paymentMethods={paymentMethods}
          selectedPaymentMethod={paymentMethod}
          updatePaymentMethod={updatePaymentMethod}
          handleAddNewPaymentMethod={() => {
            updatePaymentMethod({ isStored: 'Y', isPreview: 'N' });
            setShowNewPaymentMethod(true);
          }}
        />
      )}

      {showNewPaymentMethod && (
        <NewPaymentMethod
          client={client}
          refreshPaymentMethods={refreshPaymentMethods}
          handleClose={() => setShowNewPaymentMethod(false)}
        />
      )}

      {showDetachConfirmation && (
        <DetachPaymentMethod
          clientId={clientId}
          refreshPaymentMethods={refreshPaymentMethods}
          paymentMethod={paymentMethodForModal}
          handleClose={() => setShowDetachConfirmation(false)}
        />
      )}

      {showEditPaymentMethod && (
        <EditPaymentMethod
          clientId={clientId}
          paymentMethodId={paymentMethodForModal.id}
          refreshPaymentMethods={refreshPaymentMethods}
          handleClose={() => setShowEditPaymentMethod(false)}
        />
      )}
    </div>
  );
}

export default PaymentMethodWidget;
