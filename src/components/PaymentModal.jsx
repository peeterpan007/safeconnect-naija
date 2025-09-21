import React, { useState, useEffect, useRef } from "react";
import "./PaymentModal.css";

import visaLogo from "../assets/visa.png";

const CARD_BRANDS = {
  visa: visaLogo,
  mastercard: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
  default: ""
};

function PaymentModal({ amount, onConfirm, onCancel }) {
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState({});
  const [closing, setClosing] = useState(false);
  const [prevBrand, setPrevBrand] = useState("default");
  const [iconClass, setIconClass] = useState("fade-in");

  const [maskedNumber, setMaskedNumber] = useState([]);
  const [maskedCVC, setMaskedCVC] = useState([]);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const lastDigitTimeoutRef = useRef(null);

  const detectCardBrand = (num) => {
    if (!num) return "default";
    if (num.startsWith("4")) return "visa";
    if (num.startsWith("5")) return "mastercard";
    return "default";
  };

  const handleChange = (field, value) => {
    if (field === "number") value = value.replace(/\D/g, "").slice(0, 16);
    if (field === "expiry") {
      value = value.replace(/[^\d]/g, "").slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (field === "cvc") value = value.replace(/\D/g, "").slice(0, 3);
    if (field === "name") value = value.slice(0, 50);

    setCard({ ...card, [field]: value });

    // Mask number
    if (field === "number") {
      if (lastDigitTimeoutRef.current) clearTimeout(lastDigitTimeoutRef.current);
      const numArr = value
        .split("")
        .map((c, i) => ({ char: i === value.length - 1 ? c : "*", isLast: i === value.length - 1 }));
      setMaskedNumber(numArr);
      lastDigitTimeoutRef.current = setTimeout(() => {
        setMaskedNumber(value.split("").map((c) => ({ char: "*", isLast: false })));
      }, 500);
    }

    // Mask CVC
    if (field === "cvc") {
      if (lastDigitTimeoutRef.current) clearTimeout(lastDigitTimeoutRef.current);
      const cvcArr = value
        .split("")
        .map((c, i) => ({ char: i === value.length - 1 ? c : "*", isLast: i === value.length - 1 }));
      setMaskedCVC(cvcArr);
      lastDigitTimeoutRef.current = setTimeout(() => {
        setMaskedCVC(value.split("").map((c) => ({ char: "*", isLast: false })));
      }, 500);
    }
  };

  const isFormValid = () =>
    card.number.length === 16 &&
    card.name.trim() !== "" &&
    /^\d{2}\/\d{2}$/.test(card.expiry) &&
    card.cvc.length === 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (card.number.length !== 16) newErrors.number = "Card number must be 16 digits";
    if (!card.name.trim()) newErrors.name = "Cardholder name required";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) newErrors.expiry = "Expiry must be MM/YY";
    if (card.cvc.length !== 3) newErrors.cvc = "CVC must be 3 digits";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Show confirmation and confetti
    setPaymentConfirmed(true);
    setShowConfetti(true);

    setCard({ number: "", name: "", expiry: "", cvc: "" });
    setMaskedNumber([]);
    setMaskedCVC([]);

    setTimeout(() => {
      setPaymentConfirmed(false);
      setShowConfetti(false);
      onConfirm();
      setClosing(true);
      setTimeout(() => onCancel(), 300);
    }, 2000);
  };

  const handleCancel = () => {
    setClosing(true);
    setTimeout(() => onCancel(), 300);
  };

  const brand = detectCardBrand(card.number);
  useEffect(() => {
    if (brand !== prevBrand) {
      setIconClass("fade-out");
      const timer = setTimeout(() => {
        setPrevBrand(brand);
        setIconClass("fade-in");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [brand, prevBrand]);

  const renderMasked = (arr) =>
    arr.map((item, i) => (
      <span key={i} className={item.isLast ? "fade-digit" : ""}>
        {item.char}
      </span>
    ));

  return (
    <div className={`payment-modal ${closing ? "fadeOut" : ""}`}>
      <div className={`payment-content ${closing ? "slideDown" : ""}`}>
        <h3>Pay ₦{amount.toLocaleString()}</h3>

        <div className="card-preview">
          {CARD_BRANDS[prevBrand] && (
            <img
              src={CARD_BRANDS[prevBrand]}
              alt={prevBrand}
              className={iconClass}
              style={{ position: "absolute", top: "10px", right: "10px", width: "50px" }}
            />
          )}

          <div className="card-number">
            {maskedNumber.length ? renderMasked(maskedNumber) : "•••• •••• •••• ••••"}
          </div>

          <div className="card-name">{card.name || "FULL NAME"}</div>

          <div className="card-details">
            <div className="card-expiry">
              <div>Expiry</div>
              <div>{card.expiry || "MM/YY"}</div>
            </div>
            <div className="card-cvc">
              <div>CVC</div>
              <div>{maskedCVC.length ? renderMasked(maskedCVC) : "•••"}</div>
            </div>
          </div>
        </div>

        {showConfetti && (
          <div className="confetti-container">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="confetti-piece" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random()}s` }}></div>
            ))}
          </div>
        )}

        {paymentConfirmed && (
          <div className="confirmation-overlay">
            <div className="checkmark">✓</div>
            <div className="confirmation-text">Payment Confirmed</div>
          </div>
        )}

        {!paymentConfirmed && (
          <form onSubmit={handleSubmit} className="payment-form">
            <input
              type="text"
              placeholder="Card Number"
              value={card.number}
              onChange={(e) => handleChange("number", e.target.value)}
              maxLength={16}
            />
            {errors.number && <small className="error">{errors.number}</small>}

            <input
              type="text"
              placeholder="Cardholder Name"
              value={card.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && <small className="error">{errors.name}</small>}

            <input
              type="text"
              placeholder="Expiry MM/YY"
              value={card.expiry}
              onChange={(e) => handleChange("expiry", e.target.value)}
            />
            {errors.expiry && <small className="error">{errors.expiry}</small>}

            <input
              type="text"
              placeholder="CVC"
              value={card.cvc}
              onChange={(e) => handleChange("cvc", e.target.value)}
              maxLength={3}
            />
            {errors.cvc && <small className="error">{errors.cvc}</small>}

            <button type="submit" disabled={!isFormValid()} style={{ opacity: isFormValid() ? 1 : 0.5 }}>
              Pay & Confirm
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;
