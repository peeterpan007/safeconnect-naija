import React, { useState } from "react";

function PhoneLogin({ onVerify }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1 = enter phone, Step 2 = enter OTP
  const [generatedOtp, setGeneratedOtp] = useState("");

  const handleSendOtp = () => {
    if (!phone.match(/^\d{10,15}$/)) {
      alert("Enter a valid phone number");
      return;
    }
    // Mock OTP generation
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setStep(2);
    console.log(`OTP for ${phone}: ${newOtp}`); // For testing only
    alert(`Mock OTP sent to ${phone}: ${newOtp}`);
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      onVerify({ id: phone, name: `User ${phone}`, phone });
    } else {
      alert("Incorrect OTP, try again.");
    }
  };

  return (
    <div className="phone-login">
      {step === 1 && (
        <div>
          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      )}
    </div>
  );
}

export default PhoneLogin;
