importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '824630117884'
  });

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  const title ='Title Title Test';
  console.log('Test');
  const options = {
    body: payload.notification.body
  };

  console.log(payload);
  return self.registration.showNotification(title,options);
})
