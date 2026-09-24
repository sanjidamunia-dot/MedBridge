import React, { useState } from "react";
import "./auth.css";

function Login({ onSignup }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		setMessage("");
		setIsLoading(true);

		try {
			const response = await fetch("http://localhost:5000/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();

			if (!response.ok) throw new Error(data.message || "Login failed.");
			localStorage.setItem("medbridgeToken", data.token);
			setMessage(`Welcome back, ${data.user.fullName}.`);
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

					<p>Your smart bridge to rare and emergency medicines.</p>

					<div className="feature">
						<span>✓</span>
						<p>Find medicines easily</p>
					</div>

					<div className="feature">
						<span>✓</span>
						<p>Verified pharmacies</p>
					</div>

					<div className="feature">
						<span>✓</span>
						<p>Fast emergency delivery</p>
					</div>

					<div className="feature">
						<span>✓</span>
						<p>Safe & secure platform</p>
					</div>
				</div>

				{/* RIGHT SIDE */}
				<div className="auth-right">
					<h2>Welcome Back!</h2>

					<p className="subtitle">Login to your MedBridge account</p>

					{/* LOGIN FORM */}
					<form onSubmit={handleSubmit}>
						{/* EMAIL */}
						<label>Email Address</label>

						<input
							type="email"
							placeholder="Enter your email"
							required
							value={email}
							onChange={(event) => setEmail(event.target.value)}
						/>

						{/* PASSWORD */}
						<label>Password</label>

						<input
							type="password"
							placeholder="Enter your password"
							required
							value={password}
							onChange={(event) => setPassword(event.target.value)}
						/>

						{/* FORGOT PASSWORD */}
						<div className="forgot">Forgot Password?</div>

						{/* LOGIN BUTTON */}
						<button type="submit">
							{isLoading ? "Logging in..." : "Login"}
						</button>

						{message && <p className="auth-message">{message}</p>}
					</form>

					{/* SIGNUP SWITCH */}
					<p className="switch">
						Don't have an account?
						<span onClick={onSignup}> Sign Up</span>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Login;
