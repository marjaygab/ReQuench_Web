$(document).ready(function() {
  $('.dropdown-toggle').dropdown();
  $('#home_container').load('Summary.html');

  $('#summary_button').on('click', function() {
    $('#home_container').load('Summary.html');
  });

  $('#activity_button').on('click', function() {
    $('#home_container').load('Activity.html');
  });


})
