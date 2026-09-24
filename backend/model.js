const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "data", "users.json");

function readUsers() {
	try {
		return JSON.parse(fs.readFileSync(usersFile, "utf8"));
	} catch (error) {
		if (error.code === "ENOENT") {
			return [];
		}
		throw error;
	}
}

function writeUsers(users) {
	fs.mkdirSync(path.dirname(usersFile), { recursive: true });
	fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function findUserByEmail(email) {
	return readUsers().find((user) => user.email === email);
}

function createUser(user) {
	const users = readUsers();
	users.push(user);
	writeUsers(users);
	return user;
}

module.exports = { findUserByEmail, createUser };
