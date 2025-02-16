# devTinder

## API LIST

## authRouter

- POST/signup
- POST/login
- POST/logout

## profileRouter

- GET/profile/view
- PATCH/profile/edit
- PATCH/profile/password

## connectionRequestRouter

- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

## userRouter

- GET /user/requests/received
- GET /user/connections
- GET /user/feed - Gets you the profiles of other users on platform

## Razorpay Payment Steps

- Signup Razorpay account
- Create api for creating order in backend
- Store the Razorpay KEY and SECRET in .env
- create initial in utils file using Razorpay
- create order by using initial.orders.create method
- save the order created in the db
- send the order to frontend
- Save the script of razorpay in index.html file
- craete the options using the order that we get from backend
- Then call the razorpay dialogue box open method using the options

## WebSockets (Sockets.io)

- Server Side Configuration:

  - Require socket.io package
  - use http server
  - initializeSocket using the server;
  - create a io using the socket.io package with the server
  - In the io create events on the connection
  - Then Create a room for both the users
  - Then using that room create events for sending messages....
  - Receive the request of joinRoom
  - Emit the event for "receive message"

- Client Side Configuration
  - Import socket.io-client package
  - create a socketConnection using the BASEURL of the backend using the package imported;
  - Then emit the actions for the events that we created in the backend
  - Emit the action to joinChat
  - Receive the action for "Receive Message" from server
