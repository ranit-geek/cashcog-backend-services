## How to start ?

This is the backend api for cashcog expenses approval system. This GraphQL api exposes the expense events to the frontend client.

1. Clone the repository
2. Install pm2
```
    npm install pm2 -g
```

3. In ecosystem.config.js fill in the MongoDB connection string where the expense events are stored by cashcog-consumer.
4. Run the following command from the root folder:
```
    npm install
```
5. Run the following command from the root folder:
```
    pm2 start ecosystem.config.js --env production
```
This will start the server at http://localhost:5000/graphql

### Live Demo: http://35.193.38.221:9090/graphql