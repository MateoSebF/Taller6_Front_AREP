const API_URL = "https://arepmateo.duckdns.org:8080/api/properties"; // Replace with your actual API

// Load all properties when the page loads
document.addEventListener("DOMContentLoaded", fetchProperties);

// Show error message
function showError(message) {
    const errorDiv = document.getElementById("error-message");
    errorDiv.innerText = message;
    errorDiv.classList.remove("hidden");

    // Hide the message after 3 seconds
    setTimeout(() => {
        errorDiv.classList.add("hidden");
    }, 3000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById("exit-message");
    successDiv.innerText = message;
    successDiv.classList.remove("hidden");

    // Hide the message after 3 seconds
    setTimeout(() => {
        successDiv.classList.add("hidden");
    }, 3000);
}

// Validate form inputs
function validateInputs(address, price, size) {
    if (!address.trim()) {
        showError("❌ Address is required!");
        return false;
    }
    if (price === "" || price < 0) {
        showError("❌ Price must be a positive number!");
        return false;
    }
    if (size === "" || size < 1) {
        showError("❌ Size must be at least 1 mt²!");
        return false;
    }
    return true;
}

// Add or Update Property
function submitProperty() {
    const id = document.getElementById("property-id").value;
    const address = document.getElementById("address").value;
    const price = parseFloat(document.getElementById("price").value);
    const size = parseInt(document.getElementById("size").value);
    const description = document.getElementById("description").value;

    if (!validateInputs(address, price, size)) {
        return; // Stop if validation fails
    }

    const propertyData = { address, price, size, description };

    if (id) {
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(propertyData)
        })
        .then(response => {
            if (!response.ok) throw new Error("Error updating property!");
            return response.json();
        })
        .then(() => {
            resetForm();
            fetchProperties();
            showSuccess("✅ Property updated successfully!");
        })
        .catch(error => showError("❌ Error updating property!"));
    } else {
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(propertyData)
        })
        .then(response => {
            if (!response.ok) throw new Error("Error adding property!");
            return response.json();
        })
        .then(() => {
            resetForm();
            fetchProperties();
            showSuccess("✅ Property added successfully!");
        })
        .catch(error => showError("❌ Error adding property!"));
    }
}

let currentPage = 0;
const pageSize = 5;

function fetchProperties() {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage);
    searchParams.append("size", pageSize);

    // Add filters if provided
    const searchAddress = document.getElementById("search-address").value;
    const minPrice = document.getElementById("search-min-price").value;
    const maxPrice = document.getElementById("search-max-price").value;
    const minSize = document.getElementById("search-min-size").value;
    const maxSize = document.getElementById("search-max-size").value;

    if (searchAddress) searchParams.append("address", searchAddress);
    if (minPrice) searchParams.append("minPrice", minPrice);
    if (maxPrice) searchParams.append("maxPrice", maxPrice);
    if (minSize) searchParams.append("minSize", minSize);
    if (maxSize) searchParams.append("maxSize", maxSize);

    fetch(`${API_URL}?${searchParams.toString()}`)
        .then(response => response.json())
        .then(data => {
            const propertyList = document.getElementById("property-list");
            propertyList.innerHTML = "";

            data.content.forEach(property => {
                const row = `
                    <tr>
                        <td>${property.id}</td>
                        <td>${property.address}</td>
                        <td>$${property.price}</td>
                        <td>${property.size} mt^2</td>
                        <td>${property.description}</td>
                        <td>
                            <button class="edit-btn" onclick="editProperty(${property.id})">✏️</button>
                            <button class="delete-btn" onclick="deleteProperty(${property.id})">🗑️</button>
                        </td>
                    </tr>
                `;
                propertyList.innerHTML += row;
            });
            
            updatePaginationButtons(data);
        })
        .catch(error => showError("❌ Error fetching properties!"));
}

// Pagination Controls
function updatePaginationButtons(data) {
    document.getElementById("prev-page").disabled = data.first;
    document.getElementById("next-page").disabled = data.last;
}

// Change Page
function changePage(step) {
    currentPage += step;
    fetchProperties();
}

// Edit Property
function editProperty(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(property => {
            document.getElementById("property-id").value = property.id;
            document.getElementById("address").value = property.address;
            document.getElementById("price").value = property.price;
            document.getElementById("size").value = property.size;
            document.getElementById("description").value = property.description;

            document.getElementById("form-title").innerText = "Edit Property";
        })
        .catch(error => showError("❌ Error fetching property details!"));
}

// Delete Property
function deleteProperty(id) {
    if (confirm("Are you sure you want to delete this property?")) {
        fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) throw new Error("Error deleting property!");
            fetchProperties();
            showSuccess("✅ Property deleted successfully!");
        })
        .catch(error => showError("❌ Error deleting property!"));
    }
}

// Reset Form
function resetForm() {
    document.getElementById("property-id").value = "";
    document.getElementById("address").value = "";
    document.getElementById("price").value = "";
    document.getElementById("size").value = "";
    document.getElementById("description").value = "";
    document.getElementById("form-title").innerText = "Add New Property";
}
