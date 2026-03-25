const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "carbon_footprint_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Yash@2006",
    database: "carbon_tracker"
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

            try {
                const hashedPassword = await bcrypt.hash(password, 10);

                const insertQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
                db.query(insertQuery, [name, email, hashedPassword], (err) => {
                    if (err) {
                        console.error("Error registering user:", err);
                        return res.status(500).json({ message: "Registration failed" });
                    }

                    return res.status(200).json({ message: "Registration successful" });
                });
            } catch (hashError) {
                console.error("Password hash error:", hashError);
                return res.status(500).json({ message: "Server error while securing password" });
            }
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

            req.session.userId = user.id;
            req.session.userName = user.name;
            req.session.userEmail = user.email;

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

// Get logged in user
app.get("/user", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "User not logged in" });
    }

    return res.status(200).json({
        id: req.session.userId,
        name: req.session.userName,
        email: req.session.userEmail
    });
});

// Save daily entry and calculate CO2
app.post("/daily-entry", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Please login first" });
    }

    const {
        entry_date,
        electricity_kwh = 0,
        bike_km = 0,
        car_km = 0,
        bus_km = 0,
        train_km = 0,
        lpg_kg = 0,
        waste_kg = 0,
        recycled_kg = 0,
        water_liters = 0,
        veg_meals = 0,
        nonveg_meals = 0
    } = req.body;

    if (!entry_date) {
        return res.status(400).json({ message: "Date is required" });
    }

    const electricity = parseFloat(electricity_kwh) || 0;
    const bike = parseFloat(bike_km) || 0;
    const car = parseFloat(car_km) || 0;
    const bus = parseFloat(bus_km) || 0;
    const train = parseFloat(train_km) || 0;
    const lpg = parseFloat(lpg_kg) || 0;
    const waste = parseFloat(waste_kg) || 0;
    const recycled = parseFloat(recycled_kg) || 0;
    const water = parseFloat(water_liters) || 0;
    const veg = parseInt(veg_meals) || 0;
    const nonveg = parseInt(nonveg_meals) || 0;

    const total_co2 =
        (electricity * 0.82) +
        (bike * 0.05) +
        (car * 0.21) +
        (bus * 0.08) +
        (train * 0.04) +
        (lpg * 3.0) +
        (waste * 0.5) +
        (water * 0.0003) +
        (veg * 0.5) +
        (nonveg * 2.5) -
        (recycled * 0.2);

    const insertQuery = `
        INSERT INTO daily_entries
        (
            user_id, entry_date, electricity_kwh, bike_km, car_km, bus_km, train_km,
            lpg_kg, waste_kg, recycled_kg, water_liters, veg_meals, nonveg_meals, total_co2
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        insertQuery,
        [
            req.session.userId,
            entry_date,
            electricity,
            bike,
            car,
            bus,
            train,
            lpg,
            waste,
            recycled,
            water,
            veg,
            nonveg,
            total_co2.toFixed(2)
        ],
        (err) => {
            if (err) {
                console.error("Error saving daily entry:", err);
                return res.status(500).json({ message: "Failed to save daily data" });
            }

            let suggestion = "";
            if (total_co2 < 5) {
                suggestion = "Excellent! Your carbon footprint is low today.";
            } else if (total_co2 < 15) {
                suggestion = "Moderate footprint. Try reducing electricity and vehicle usage.";
            } else {
                suggestion = "High footprint. Use public transport, save electricity and reduce waste.";
            }

            return res.status(200).json({
                message: "Daily data saved successfully",
                total_co2: total_co2.toFixed(2),
                suggestion
            });
        }
    );
});

// Fetch all entries of logged in user
app.get("/entries", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Please login first" });
    }

    const query = `
        SELECT * FROM daily_entries
        WHERE user_id = ?
        ORDER BY entry_date DESC, id DESC
    `;

    db.query(query, [req.session.userId], (err, results) => {
        if (err) {
            console.error("Error fetching entries:", err);
            return res.status(500).json({ message: "Failed to fetch entries" });
        }

        return res.status(200).json(results);
    });
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        return res.status(200).json({ message: "Logged out successfully" });
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