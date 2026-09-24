const express = require("express");
const crypto = require("crypto");
const { createUser, findUserByEmail } = require("./model");

const router = express.Router();
const allowedRoles = ["patient", "pharmacy", "supplier", "delivery"];
const tokenSecret = process.env.JWT_SECRET || "medbridge-development-secret";

function normalizeEmail(email) {
	return String(email || "").trim().toLowerCase();
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
	const hash = crypto.scryptSync(password, salt, 64).toString("hex");
	return `${salt}:${hash}`;
}

function passwordMatches(password, storedHash) {
	const [salt, hash] = String(storedHash).split(":");
	if (!salt || !hash) return false;

	const derivedHash = crypto.scryptSync(password, salt, 64).toString("hex");
	return crypto.timingSafeEqual(
		Buffer.from(hash, "hex"),
		Buffer.from(derivedHash, "hex")
	);
}

function createToken(user) {
	const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
	const header = encode({ alg: "HS256", typ: "JWT" });
	const payload = encode({ sub: user.id, email: user.email, role: user.role });
	const signature = crypto
		.createHmac("sha256", tokenSecret)
		.update(`${header}.${payload}`)
		.digest("base64url");
	return `${header}.${payload}.${signature}`;
}

router.post("/signup", (req, res) => {
	const { fullName, email, phone, password, role } = req.body || {};
	const normalizedEmail = normalizeEmail(email);

	if (!fullName || !normalizedEmail || !phone || !password || !role) {
		return res.status(400).json({ message: "All signup fields are required." });
	}
	if (password.length < 6) {
		return res.status(400).json({ message: "Password must be at least 6 characters." });
	}
	if (!allowedRoles.includes(role)) {
		return res.status(400).json({ message: "Please select a valid role." });
	}
	if (findUserByEmail(normalizedEmail)) {
		return res.status(409).json({ message: "An account with this email already exists." });
	}

	const user = createUser({
		id: crypto.randomUUID(),
		fullName: String(fullName).trim(),
		email: normalizedEmail,
		phone: String(phone).trim(),
		role,
		passwordHash: hashPassword(password),
		createdAt: new Date().toISOString(),
	});

	return res.status(201).json({
		message: "Account created successfully.",
		token: createToken(user),
		user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
	});
});

router.post("/login", (req, res) => {
	const { email, password } = req.body || {};
	const user = findUserByEmail(normalizeEmail(email));

	if (!user || !password || !passwordMatches(password, user.passwordHash)) {
		return res.status(401).json({ message: "Invalid email or password." });
	}

	return res.json({
		message: "Login successful.",
		token: createToken(user),
		user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
	});
});

module.exports = router;
