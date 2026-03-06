/**
 * Negotiation Logic
 * Core negotiation strategy and decision-making
 */

const { NEGOTIATION_CONFIG } = require("./config");
const {
  createOrUpdateSession,
  getSession,
  acceptNegotiation,
} = require("./store");

/**
 * Calculate the minimum acceptable price for a product
 * @param {number} originalPrice
 * @returns {number}
 */
const getMinAcceptablePrice = (originalPrice) => {
  const discountedPrice =
    originalPrice * (1 - NEGOTIATION_CONFIG.MAX_DISCOUNT_PERCENT / 100);
  return Math.max(discountedPrice, NEGOTIATION_CONFIG.MIN_PRICE_FLOOR);
};

/**
 * Calculate a counter-offer price
 * @param {number} userOffer - What the user offered
 * @param {number} originalPrice - Original product price
 * @param {number} round - Current negotiation round
 * @returns {number}
 */
const calculateCounterOffer = (userOffer, originalPrice, round) => {
  const minPrice = getMinAcceptablePrice(originalPrice);

  // As rounds progress, the AI gradually gives more discount
  const roundFactor = Math.min(round / NEGOTIATION_CONFIG.MAX_ROUNDS, 1);
  const flexibility =
    NEGOTIATION_CONFIG.COUNTER_OFFER_FACTOR - roundFactor * 0.15;

  // Counter offer moves between original and user's offer
  let counterOffer = userOffer + (originalPrice - userOffer) * flexibility;

  // Ensure counter offer is not below minimum
  counterOffer = Math.max(counterOffer, minPrice);

  // Round to nearest integer
  return Math.round(counterOffer);
};

/**
 * Process a negotiation request
 * @param {string} userId
 * @param {string} productId
 * @param {string} productName
 * @param {number} originalPrice
 * @param {number} userOffer - The price the user wants
 * @returns {Object} negotiation result
 */
const processNegotiation = (
  userId,
  productId,
  productName,
  originalPrice,
  userOffer,
) => {
  const minPrice = getMinAcceptablePrice(originalPrice);
  const existingSession = getSession(userId, productId);
  const currentRound = existingSession ? existingSession.round + 1 : 1;

  // Validate user offer
  if (userOffer <= 0 || isNaN(userOffer)) {
    return {
      status: "invalid",
      message: "Please provide a valid price offer.",
      originalPrice,
      productName,
    };
  }

  // If user offers more than or equal to original price
  if (userOffer >= originalPrice) {
    return {
      status: "no_need",
      message: `The product is already priced at ₹${originalPrice}. Your offer is at or above the current price!`,
      originalPrice,
      productName,
    };
  }

  // Calculate discount percentage requested
  const requestedDiscount = ((originalPrice - userOffer) / originalPrice) * 100;

  // Auto-accept if discount is within auto-accept threshold
  if (requestedDiscount <= NEGOTIATION_CONFIG.AUTO_ACCEPT_THRESHOLD) {
    const deal = acceptNegotiation(userId, productId, userOffer);
    createOrUpdateSession(userId, productId, {
      productName,
      originalPrice,
      currentOffer: userOffer,
      negotiatedPrice: userOffer,
      status: "accepted",
      incrementRound: true,
    });

    return {
      status: "accepted",
      negotiatedPrice: userOffer,
      originalPrice,
      discount: Math.round(requestedDiscount),
      token: deal.token,
      productId,
      productName,
      expiresAt: deal.expiresAt,
      message: `Great deal! I can offer you **${productName}** for **₹${userOffer}** (${Math.round(requestedDiscount)}% off). This price is valid for 30 minutes.`,
    };
  }

  // If user offer is below minimum acceptable price
  if (userOffer < minPrice) {
    // Check if we've exceeded max rounds
    if (currentRound >= NEGOTIATION_CONFIG.MAX_ROUNDS) {
      // Final offer: give them the minimum price
      const deal = acceptNegotiation(userId, productId, minPrice);
      createOrUpdateSession(userId, productId, {
        productName,
        originalPrice,
        currentOffer: userOffer,
        negotiatedPrice: minPrice,
        status: "accepted",
        incrementRound: true,
      });

      const finalDiscount = Math.round(
        ((originalPrice - minPrice) / originalPrice) * 100,
      );
      return {
        status: "final_offer_accepted",
        negotiatedPrice: minPrice,
        originalPrice,
        discount: finalDiscount,
        token: deal.token,
        productId,
        productName,
        expiresAt: deal.expiresAt,
        message: `Alright, this is my best and final offer! I can give you **${productName}** for **₹${minPrice}** (${finalDiscount}% off). This is the lowest I can go. Deal valid for 30 minutes!`,
      };
    }

    // Counter offer
    const counterOffer = calculateCounterOffer(
      userOffer,
      originalPrice,
      currentRound,
    );
    createOrUpdateSession(userId, productId, {
      productName,
      originalPrice,
      currentOffer: userOffer,
      counterOffer,
      status: "negotiating",
      incrementRound: true,
    });

    const counterDiscount = Math.round(
      ((originalPrice - counterOffer) / originalPrice) * 100,
    );
    return {
      status: "counter_offer",
      counterOffer,
      originalPrice,
      discount: counterDiscount,
      round: currentRound,
      maxRounds: NEGOTIATION_CONFIG.MAX_ROUNDS,
      productId,
      productName,
      message: `I appreciate the offer, but ₹${userOffer} is a bit too low for **${productName}**. How about **₹${counterOffer}** instead? That's ${counterDiscount}% off the original price of ₹${originalPrice}!`,
    };
  }

  // User offer is between min price and auto-accept threshold — accept it!
  const deal = acceptNegotiation(userId, productId, userOffer);
  createOrUpdateSession(userId, productId, {
    productName,
    originalPrice,
    currentOffer: userOffer,
    negotiatedPrice: userOffer,
    status: "accepted",
    incrementRound: true,
  });

  return {
    status: "accepted",
    negotiatedPrice: userOffer,
    originalPrice,
    discount: Math.round(requestedDiscount),
    token: deal.token,
    productId,
    productName,
    expiresAt: deal.expiresAt,
    message: `You've got a deal! 🤝 I can offer you **${productName}** for **₹${userOffer}** (${Math.round(requestedDiscount)}% off). This price is valid for 30 minutes. Add it to your cart to lock in this price!`,
  };
};

/**
 * Start a negotiation directly (from cart button click)
 * Immediately gives the user a discount without back-and-forth
 * @param {string} userId
 * @param {string} productId
 * @param {string} productName
 * @param {number} originalPrice
 * @param {number|null} userOffer - Optional specific price the user wants
 * @returns {Object} negotiation result with token
 */
const startNegotiation = (
  userId,
  productId,
  productName,
  originalPrice,
  userOffer = null,
) => {
  // If user provided a specific offer, use the normal negotiation flow
  if (userOffer !== null && userOffer !== undefined) {
    return processNegotiation(
      userId,
      productId,
      productName,
      originalPrice,
      userOffer,
    );
  }

  // Auto-generate a discount: give a reasonable immediate discount
  // Use a value between AUTO_ACCEPT_THRESHOLD and MAX_DISCOUNT_PERCENT
  const autoDiscountPercent = Math.min(
    NEGOTIATION_CONFIG.AUTO_ACCEPT_THRESHOLD +
      Math.floor(
        Math.random() *
          (NEGOTIATION_CONFIG.MAX_DISCOUNT_PERCENT -
            NEGOTIATION_CONFIG.AUTO_ACCEPT_THRESHOLD) *
          0.6,
      ),
    NEGOTIATION_CONFIG.MAX_DISCOUNT_PERCENT,
  );

  const discountedPrice = Math.round(
    originalPrice * (1 - autoDiscountPercent / 100),
  );
  const finalPrice = Math.max(
    discountedPrice,
    NEGOTIATION_CONFIG.MIN_PRICE_FLOOR,
  );
  const actualDiscount = Math.round(
    ((originalPrice - finalPrice) / originalPrice) * 100,
  );

  // Accept the deal immediately
  const deal = acceptNegotiation(userId, productId, finalPrice);
  createOrUpdateSession(userId, productId, {
    productName,
    originalPrice,
    currentOffer: finalPrice,
    negotiatedPrice: finalPrice,
    status: "accepted",
    incrementRound: true,
  });

  return {
    status: "accepted",
    negotiatedPrice: finalPrice,
    originalPrice,
    discount: actualDiscount,
    token: deal.token,
    productId,
    productName,
    expiresAt: deal.expiresAt,
    message: `Great news! 🎉 You've unlocked a special deal on **${productName}**! Price dropped from **₹${originalPrice}** to **₹${finalPrice}** (${actualDiscount}% off). This price is valid for 30 minutes.`,
  };
};

module.exports = {
  processNegotiation,
  startNegotiation,
  getMinAcceptablePrice,
  calculateCounterOffer,
};
