const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Yash@2006",
    database: "login_system"
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("MySQL connected successfully");
});

// Register API
app.post("/register", async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const checkUserQuery = "SELECT * FROM users WHERE email = ?";
        db.query(checkUserQuery, [email], async (err, result) => {
            if (err) {
                console.error("Error checking user:", err);
                return res.status(500).json({ message: "Server error while checking user" });
            }

            if (result.length > 0) {
                return res.status(400).json({ message: "Email already registered" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const insertQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
            db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error("Error registering user:", err);
                    return res.status(500).json({ message: "Registration failed" });
                }

                return res.status(200).json({ message: "Registration successful" });
            });
        });

    } catch (error) {
        console.error("Register route error:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

// Login API
app.post("/login", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const query = "SELECT * FROM users WHERE email = ? AND name = ?";

    db.query(query, [email, name], async (err, result) => {
        if (err) {
            console.error("Login error:", err);
            return res.status(500).json({ message: "Server error during login" });
        }

        if (result.length === 0) {
            return res.status(400).json({ message: "Invalid name or email" });
        }

        const user = result[0];

        try {
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password" });
            }

            return res.status(200).json({
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error("Password compare error:", error);
            return res.status(500).json({ message: "Server error during password verification" });
        }
    });
});

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});