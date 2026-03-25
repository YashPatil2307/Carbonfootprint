const BASE_URL = "http://localhost:3000";

async function loadUser() {
    try {
        const response = await fetch(`${BASE_URL}/user`, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("userName").textContent = "Welcome, " + data.name;
        } else {
            alert("Please login first");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Load user error:", error);
        alert("Unable to load user");
        window.location.href = "index.html";
    }
}

async function loadEntries() {
    try {
        const response = await fetch(`${BASE_URL}/entries`, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();
        const tbody = document.getElementById("entriesBody");
        tbody.innerHTML = "";

        if (!response.ok) {
            tbody.innerHTML = `<tr><td colspan="7">Failed to load records</td></tr>`;
            return;
        }

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7">No records found</td></tr>`;
            return;
        }

        data.forEach((entry) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${new Date(entry.entry_date).toISOString().split("T")[0]}</td>
                <td>${entry.electricity_kwh}</td>
                <td>${entry.bike_km}</td>
                <td>${entry.car_km}</td>
                <td>${entry.bus_km}</td>
                <td>${entry.train_km}</td>
                <td>${entry.total_co2}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Load entries error:", error);
        document.getElementById("entriesBody").innerHTML =
            `<tr><td colspan="7">Something went wrong</td></tr>`;
    }
}

document.getElementById("dailyForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        entry_date: document.getElementById("entry_date").value,
        electricity_kwh: document.getElementById("electricity_kwh").value || 0,
        bike_km: document.getElementById("bike_km").value || 0,
        car_km: document.getElementById("car_km").value || 0,
        bus_km: document.getElementById("bus_km").value || 0,
        train_km: document.getElementById("train_km").value || 0,
        lpg_kg: document.getElementById("lpg_kg").value || 0,
        waste_kg: document.getElementById("waste_kg").value || 0,
        recycled_kg: document.getElementById("recycled_kg").value || 0,
        water_liters: document.getElementById("water_liters").value || 0,
        veg_meals: document.getElementById("veg_meals").value || 0,
        nonveg_meals: document.getElementById("nonveg_meals").value || 0
    };

    try {
        const response = await fetch(`${BASE_URL}/daily-entry`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("resultText").textContent =
                "Total CO₂ Emission: " + data.total_co2 + " kg";
            document.getElementById("suggestionText").textContent = data.suggestion;

            document.getElementById("dailyForm").reset();
            loadEntries();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Save daily data error:", error);
        alert("Something went wrong while saving daily data");
    }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
        const response = await fetch(`${BASE_URL}/logout`, {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();
        alert(data.message);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Logout error:", error);
        alert("Logout failed");
    }
});

loadUser();
loadEntries();