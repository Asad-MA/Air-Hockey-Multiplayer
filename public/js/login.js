jQuery(document).ready(function ($) {
    const form = $("form");
    const loader = $(".loader");

    // Function to remove all error messages
    function clearErrors() {
        $(".error-message").remove();
        $(".genaric-error").remove();
        $(".genaric-success").remove();
    }

    // Remove errors when input changes
    form.find("input").on("input", function () {
        $(this).next(".error-message").remove();
        $(".genaric-error").remove();
        $(".genaric-success").remove();
    });

    form.on("submit", async function (event) {
        event.preventDefault();
        loader.addClass("active");
        // Clear errors before submitting
        clearErrors();

        const formData = form.serializeArray();
        const data = {
            email: formData.find(item => item.name === "email")?.value,
            password: formData.find(item => item.name === "password")?.value,
            remember: $("#remember").prop("checked")
        };

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            loader.removeClass("active");
            console.log("Result:", result);

            if(!result.success){
                result.status = 500;
                 throw new Error(JSON.stringify(result));
            }
            //console.log(response);
            if (!response.ok) {
                result.status = response.status;
                throw new Error(JSON.stringify(result));
            }

            if(result.token)
                 window.location.href = '/';

            form.trigger('reset');
           // alert("Registration successful!");
        } catch (error) {
            console.log(error);
            const errors = JSON.parse(error.message);
            console.log(errors , errors.status);

            if(errors.status == 500){
                $('.divider').after(`<div class="genaric-error mb-30 mt-20"><p class="error-message"><i class="fa-solid fa-triangle-exclamation"></i> ${errors.error}</p></div>`);
                return;
            }

            

            for (const error in errors) {
                $(`[name="${error}"]`).after(`<p class="error-message"><i class="fa-solid fa-triangle-exclamation"></i> ${errors[error][0]}</p>`);
            }
        }
    });
});
