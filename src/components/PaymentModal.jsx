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

    // Masking logic for card number
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

    // Masking logic for CVC
    if (field === "cvc") {
      if (lastDigitTimeoutRef.current) clearTimeout(lastDigitTimeoutRef.current);
      const cvcArr = value.split("").map((c, i) => ({ char: i === value.length - 1 ? c : "*", isLast: i === value.length - 1 }));
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

    alert(`Payment of ₦${amount.toLocaleString()} successful!`);
    onConfirm();
    setCard({ number: "", name: "", expiry: "", cvc: "" });
    setMaskedNumber([]);
    setMaskedCVC([]);
  };

  const handleCancel = () => {
    setClosing(true);
    setTimeout(() => onCancel(), 300);
  };

  // Smooth logo transition
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

  const maskedExpiry = card.expiry.padEnd(5, "•");

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

        {/* Card Preview */}
        <div className="card-preview" style={{ position: "relative", padding: "20px", borderRadius: "10px", background: "#1a1f71", color: "#fff" }}>
          {CARD_BRANDS[prevBrand] && (
            <img
              src={CARD_BRANDS[prevBrand]}
              alt={prevBrand}
              className={iconClass}
              style={{ position: "absolute", top: "10px", right: "10px", width: "50px" }}
            />
          )}

          {/* Card Number */}
          <div className="card-number" style={{ fontSize: "1.4em", letterSpacing: "2px" }}>
            {maskedNumber.length ? renderMasked(maskedNumber) : "•••• •••• •••• ••••"}
          </div>

          {/* Cardholder Name */}
          <div className="card-name" style={{ marginTop: "15px", fontSize: "0.9em" }}>
            {card.name || "FULL NAME"}
          </div>

          {/* Expiry & CVC row */}
          <div className="card-details" style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <div className="card-expiry">
              <div style={{ fontSize: "0.7em", color: "#ccc" }}>Expiry</div>
              <div>{card.expiry || "MM/YY"}</div>
            </div>
            <div className="card-cvc">
              <div style={{ fontSize: "0.7em", color: "#ccc" }}>CVC</div>
              <div>{maskedCVC.length ? renderMasked(maskedCVC) : "•••"}</div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="payment-form" style={{ marginTop: "20px" }}>
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
      </div>
    </div>
  );
}

export default PaymentModal;
