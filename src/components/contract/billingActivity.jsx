import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import moment from 'moment-timezone';

import { Mobile, NotMobile } from '../common/responsive';
import Icon from '../common/icon';

import { formatCurrency, formatPaymentMethod } from '../../util';

import '../../styles/components/contract.scss';

function BillingActivity({ contract }) {
  const transactions = contract.transactions.filter(t => t.adminOnly !== 'Y');

  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(-1);

  if (transactions.length === 0) {
    return (
      <div className="billing-activity border-top">
        <div className="header flex-row-aligned py-3" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded && <Icon name="less" />}
          {!isExpanded && <Icon name="more" />}
          <h3>Billing Activity</h3>
        </div>
        <Collapse in={isExpanded}>
          <p className="ms-4 sura">
            No billing activity has been recorded in this system for this Health Plan
          </p>
        </Collapse>
      </div>
    );
  }

  return (
    <div className="billing-activity border-top">
      <div className="header flex-row-aligned py-3" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded && <Icon name="less" />}
        {!isExpanded && <Icon name="more" />}
        <h3>Billing Activity</h3>
      </div>
      <Mobile>
        <Collapse in={isExpanded}>
          <div>
            {transactions.map((t, i) => (
              <div key={i} className={`p-2 ${i % 2 === 0 ? 'background-gray' : ''}`}>
                {t.status === 'Failed' && <p className="red sura font-12 mb-2">*Payment failed</p>}
                <div className="d-flex justify-content-between">
                  <div className="form-control-read-only">
                    <label className="mb-2" htmlFor={`transactionDate_${i}`}>
                      Date
                    </label>
                    <p id={`transactionDate_${i}`}>{moment(t.insertTs).format('MM/DD/YYYY')}</p>
                  </div>
                  <div className="form-control-read-only">
                    <label className="mb-2" htmlFor={`transactionAmount_${i}`}>
                      Amount
                    </label>
                    <p id={`transactionAmount_${i}`} className="text-end">
                      {formatCurrency(t.amount)}
                    </p>
                  </div>
                </div>
                <div className="form-control-read-only mt-3">
                  <label className="mb-2" htmlFor={`transactionDescription_${i}`}>
                    Description
                  </label>
                  <p id={`transactionDescription_${i}`}>{t.description}</p>
                </div>
                {expandedIndex !== i && (
                  <button
                    type="button"
                    className="blue sura font-14"
                    onClick={() => setExpandedIndex(i)}
                  >
                    <Icon name="add" className="me-1" />
                    More
                  </button>
                )}
                {expandedIndex === i && (
                  <React.Fragment>
                    {t.status && (
                      <div className="form-control-read-only mt-3">
                        <label className="mb-2" htmlFor={`transactionStatus_${i}`}>
                          Status
                        </label>
                        <p id={`transactionStatus_${i}`}>
                          <span>
                            <span>{t.status}</span>
                            {t.status === 'Failed' && (
                              <Icon
                                name="on_hold"
                                className="ms-2 red"
                                tooltipText={
                                  t.failureMessage
                                    ? t.failureMessage
                                    : 'Payment could not be processed'
                                }
                              />
                            )}
                          </span>
                        </p>
                      </div>
                    )}
                    {t.category && (
                      <div className="form-control-read-only mt-3">
                        <label className="mb-2" htmlFor={`transactionPaymentMethod_${i}`}>
                          Payment Method
                        </label>
                        <p id={`transactionPaymentMethod_${i}`}>
                          {t.category ? formatPaymentMethod(t, true) : ''}
                        </p>
                      </div>
                    )}
                    <div className="form-control-read-only mt-3">
                      <label className="mb-2" htmlFor={`transactionBalance_${i}`}>
                        Balance
                      </label>
                      <p id={`transactionBalance_${i}`}>{formatCurrency(t.balance)}</p>
                    </div>
                    <button
                      type="button"
                      className="blue sura font-14"
                      onClick={() => setExpandedIndex(-1)}
                    >
                      <Icon name="subtract" className="me-1" />
                      Less
                    </button>
                  </React.Fragment>
                )}
              </div>
            ))}
          </div>
        </Collapse>
      </Mobile>
      <NotMobile>
        <Collapse in={isExpanded}>
          <div className="d-flex flex-column">
            <div className="w-100">
              <table className="w-100">
                <thead className="border-bottom border-top">
                  <tr>
                    <th>Date</th>
                    <th className="description">Description</th>
                    <th className="payment-method">Payment Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i} className={i % 2 === 0 ? `background-gray` : ''}>
                      <td>{moment(t.insertTs).format('MM/DD/YYYY')}</td>
                      <td className="description">{t.description}</td>
                      <td className="payment-method">
                        {t.category ? formatPaymentMethod(t, true) : ''}
                      </td>
                      <td>{formatCurrency(t.amount)}</td>
                      <td>
                        <span>{t.status}</span>
                        {t.status === 'Failed' && (
                          <Icon
                            name="on_hold"
                            className="ms-2 red"
                            tooltipText={
                              t.failureMessage ? t.failureMessage : 'Payment could not be processed'
                            }
                          />
                        )}
                      </td>
                      <td>{formatCurrency(t.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Collapse>
      </NotMobile>
    </div>
  );
}

export default BillingActivity;
