import React, { useState, useEffect } from "react";
import "./PaymentModal.css";

import visaLogo from "../assets/visa.png"; // ✅ local Visa logo

const CARD_BRANDS = {
  visa: visaLogo,
  mastercard: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
  default: "" // Removed invalid default
};

function PaymentModal({ amount, onConfirm, onCancel }) {
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState({});
  const [closing, setClosing] = useState(false);
  const [prevBrand, setPrevBrand] = useState("default");
  const [iconClass, setIconClass] = useState("fade-in");

  // Format card number as "1234 5678 9012 3456"
  const formatCardNumber = (num) =>
    num.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  // Detect brand for icon
  const detectCardBrand = (num) => {
    if (!num) return "default";
    const firstDigit = num[0];
    if (firstDigit === "4") return "visa";
    if (firstDigit === "5") return "mastercard";
    return "default";
  };

  // Handle input changes
  const handleChange = (field, value) => {
    if (field === "number") {
      value = value.replace(/\D/g, "").slice(0, 16);
    }
    if (field === "expiry") {
      value = value.replace(/[^\d]/g, "").slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setCard({ ...card, [field]: value });
  };

  // CVC masking
  const handleCVCChange = (e) => {
    const input = e.target.value;
    let newCVC = card.cvc;

    if (input.length > card.cvc.length) {
      newCVC = (card.cvc + input.slice(-1)).slice(0, 3);
    }
    if (input.length < card.cvc.length) {
      newCVC = newCVC.slice(0, input.length);
    }

    setCard({ ...card, cvc: newCVC });
  };

  // Validate form
  const isFormValid = () => {
    return (
      card.number.replace(/\s/g, "").length === 16 &&
      card.name.trim() !== "" &&
      /^\d{2}\/\d{2}$/.test(card.expiry) &&
      card.cvc.length === 3
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (card.number.replace(/\s/g, "").length !== 16) newErrors.number = "Card number must be 16 digits";
    if (!card.name.trim()) newErrors.name = "Cardholder name required";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) newErrors.expiry = "Expiry must be MM/YY";
    if (card.cvc.length !== 3) newErrors.cvc = "CVC must be 3 digits";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    alert(`Payment of ₦${amount.toLocaleString()} successful!`);
    onConfirm();
    setCard({ number: "", name: "", expiry: "", cvc: "" });
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

  const maskedCVC = card.cvc.replace(/./g, "*").padEnd(3, "•");
  const maskedExpiry = card.expiry.padEnd(5, "•");

  return (
    <div className={`payment-modal ${closing ? "fadeOut" : ""}`}>
      <div className={`payment-content ${closing ? "slideDown" : ""}`}>
        <h3>Pay ₦{amount.toLocaleString()}</h3>

        <div className="card-preview" style={{ position: "relative" }}>
          {CARD_BRANDS[prevBrand] && (
            <img
              src={CARD_BRANDS[prevBrand]}
              alt={prevBrand}
              className={iconClass}
              style={{ position: "absolute", top: "10px", right: "10px", width: "50px" }}
            />
          )}
          <div className="card-number">{formatCardNumber(card.number).padEnd(19, "•")}</div>
          <div className="card-name">{card.name || "FULL NAME"}</div>
          <div className="card-expiry">{maskedExpiry}</div>
          <div className="card-cvc">{maskedCVC}</div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <input
            type="text"
            placeholder="Card Number"
            value={formatCardNumber(card.number)}
            onChange={(e) => handleChange("number", e.target.value)}
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
            value={"*".repeat(card.cvc.length)}
            onChange={handleCVCChange}
          />
          {errors.cvc && <small className="error">{errors.cvc}</small>}

          <button type="submit" disabled={!isFormValid()} style={{ opacity: isFormValid() ? 1 : 0.5 }}>
            Pay & Confirm
          </button>
          <button type="button" onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentModal;
