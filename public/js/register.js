document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        
        const data = {
            username: formData.get("username"),
            usermail: formData.get("usermail"),
            password: formData.get("password"),
            repeatPassword: formData.get("repeat-password"),
            privateAccount: document.getElementById("Private-account").checked
        };

        try {
            const response = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            console.log("Success:", result);
            alert("Registration successful!");
        } catch (error) {
            console.error("Error:", error);
            alert("Registration failed. Please try again.");
        }
    });
});
