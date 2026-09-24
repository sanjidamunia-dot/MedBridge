import React, { useState } from "react";
import "./auth.css";

function Signup({ onLogin }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Signup failed.");
      localStorage.setItem("medbridgeToken", data.token);
      setMessage("Account created successfully. You can now log in.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* LEFT SIDE */}
        <div className="auth-left">
          <div className="logo">✚</div>

          <h1>MedBridge</h1>

          <p>
            Connect with trusted pharmacies and get
            medicines faster.
          </p>

          <div className="feature">
            <span>✓</span>
            <p>Safe & secure platform</p>
          </div>

          <div className="feature">
            <span>✓</span>
            <p>Rare medicine finder</p>
          </div>

          <div className="feature">
            <span>✓</span>
            <p>Emergency medicine support</p>
          </div>

          <div className="feature">
            <span>✓</span>
            <p>Fast medicine delivery</p>
          </div>
        </div>


        {/* RIGHT SIDE */}
        <div className="auth-right">

          <h2>Create Account</h2>

          <p className="subtitle">
            Join MedBridge today
          </p>


          {/* SIGNUP FORM */}
          <form onSubmit={handleSubmit}>

            {/* FULL NAME */}
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              required
              name="fullName"
              value={form.fullName}
              onChange={updateField}
            />


            {/* EMAIL */}
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              required
              name="email"
              value={form.email}
              onChange={updateField}
            />


            {/* PHONE */}
            <label>Phone Number</label>

            <input
              type="tel"
              placeholder="Enter your phone number"
              required
              name="phone"
              value={form.phone}
              onChange={updateField}
            />


            {/* PASSWORD */}
            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              required
              name="password"
              value={form.password}
              onChange={updateField}
            />


            {/* CONFIRM PASSWORD */}
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your password"
              required
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={updateField}
            />


            {/* ROLE */}
            <label>Select Role</label>

            <select required name="role" value={form.role} onChange={updateField}>
              <option value="">
                Choose your role
              </option>

              <option value="patient">
                Patient
              </option>

              <option value="pharmacy">
                Pharmacy
              </option>

              <option value="supplier">
                Supplier
              </option>

              <option value="delivery">
                Delivery Agent
              </option>
            </select>


            {/* TERMS */}
            <div className="terms">
              <input
                type="checkbox"
                id="terms"
                required
              />

              <label htmlFor="terms">
                I agree to the Terms & Conditions
              </label>
            </div>


            {/* BUTTON */}
            <button type="submit">
              {isLoading ? "Creating account..." : "Create Account"}
            </button>

            {message && <p className="auth-message">{message}</p>}

          </form>


          {/* LOGIN SWITCH */}
          <p className="switch">
            Already have an account?
            <span onClick={onLogin}>
              {" "}Login
            </span>
          </p>

        </div>

      </div>
    </div>
  );
}

export default Signup;