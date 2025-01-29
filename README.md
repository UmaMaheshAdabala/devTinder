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
