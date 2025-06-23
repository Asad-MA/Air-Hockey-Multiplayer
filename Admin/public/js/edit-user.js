jQuery(document).ready(function ($) {
console.log('Plugged in')
    $('#btn-block').on('click', function () {
        const userID = $(this).attr('data-id');
        const data = {
            action: 'block',
            userId: userID.trim()
        }

        updateUser(data);
    })

    $('#btn-unblock').on('click', function () {
        const userID = $(this).attr('data-id');
        const data = {
            action: 'unblock',
            userId: userID.trim()
        }

        updateUser(data);
    })

    async function updateUser(data) {
  try {
    const res = await fetch('/user-status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // if using JWT in headers
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Server responded with error:", result);
      alert(result.error || "Something went wrong while updating user.");
      return;
    }

    console.log("User update successful:", result);
    alert(result.message || "User status updated.");
  } catch (err) {
    console.error("Network or parsing error:", err);
    alert("Failed to connect to server. Please try again later.");
  }
}

});