jQuery(document).ready(function ($) {
      $('input[type="range"]').on('input', function () {
    const name = $(this).attr('name');
    $(`.value[data-for="${name}"]`).text($(this).val());
  });

  // Handle form submission
  $('#game-settings-form').on('submit', function (e) {
    e.preventDefault();

    const body = {
      paddle: {
        mass: parseFloat($('[name="paddleMass"]').val()),
        maxSpeed: parseInt($('[name="paddleMaxSpeed"]').val()),
      },
      puck: {
        mass: parseFloat($('[name="puckMass"]').val()),
        maxSpeed: parseInt($('[name="puckMaxSpeed"]').val()),
        friction: parseFloat($('[name="puckFriction"]').val()),
      },
      timeLimit: parseInt($('[name="timeLimit"]').val()),
      entryFee: parseInt($('[name="entryFee"]').val()),
      rewardMultiplier: parseInt($('[name="rewardMultiplier"]').val()),
    };

    $.ajax({
      url: '/api/admin/game-settings',
      type: 'PUT',
      headers: {
        'x-admin-secret': 'your-secret-key',
      },
      contentType: 'application/json',
      data: JSON.stringify(body),
      success: function (res) {
        alert(res.message || 'Settings updated');
      },
      error: function (err) {
        alert('Failed to update settings');
      }
    });
  });
});