import type { KeyValue } from '@the-crew/common';

/**
 * Get payment session value from session storage via sessionId
 * @returns Payment session Id
 */
function getPaymentSession(key: KeyValue['key']): string {
  return sessionStorage.getItem(key);
}

/**
 * Set payment session key/value into session storage
 * @param sessionId
 */
function setPaymentSession({ key, value }: KeyValue): void {
  sessionStorage.setItem(key, value);
}

/**
 * Removes payment session object from session storage via sessionId
 */
function removePaymentSession(key: KeyValue['key']): void {
  sessionStorage.removeItem(key);
}

export { getPaymentSession, setPaymentSession, removePaymentSession };

export const PaymentSessionService = {
  getPaymentSession,
  setPaymentSession,
  removePaymentSession,
};
