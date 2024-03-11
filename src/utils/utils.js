import cardValidator from 'card-validator';

export const validateCardNumber = (cardNumber) => {
    const cardNumberValidation = cardValidator.number(cardNumber);
    return cardNumberValidation.isValid;
  };
  
  export const validateCVV = (cvv, cardType) => {
    const cvvValidation = cardValidator.cvv(cvv, cardType);
    return cvvValidation.isValid;
  };
  
  export const validateExpiryDate = (expiry) => {
    const expiryValidation = cardValidator.expirationDate(expiry);
    return expiryValidation.isValid;
  };