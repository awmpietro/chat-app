# Chat App

This is a project for Jobsity coding test purposes

[![](https://img.shields.io/badge/dependencies-docker-blue.svg)]()

[![](https://img.shields.io/badge/node-%3E%3D12-green.svg)]()
[![](https://img.shields.io/badge/express-4-important.svg)]()
[![](./server/test/badge.svg)]()

[![](https://img.shields.io/badge/react-16.14.0-lightgrey.svg)]()
[![](https://img.shields.io/badge/redux-4-9cf.svg)]()

[![](https://img.shields.io/badge/postgres-11.9-informational.svg)]()
[![](https://img.shields.io/badge/rabbitmq-3.6.14--management-blueviolet.svg)]()

## Dependency:

Chat App requires [Docker](https://docs.docker.com/docker-for-mac/install/) (Created on Docker desktop community for MacOS - Engine: 10.03.8, Compose: 1.25.4)

## How to Run:

```sh
git clone https://github.com/awmpietro/chat-app.git
cd chat-app
docker-compose up
```

Wait for the full bulding. It first can take a while. After building, you gonna see the message in console: `INFO: Accepting connections at http://localhost:5000`. Now you can access the app on [http://localhost:5000](http://localhost:5000).

- Server will run on `http://localhost:7070`; It will first run the tests before starting.
- Bot will run on `http://localhost:6060`;
- Postgress will run on `http://localhost:5432`;
- RabbitMq will run on `http://localhost:5672` and the web interface on `http://localhost:15672`.

Credentials for login (populated register, also registering new users is tottaly possible):

```sh
email: johndoe@test.com
password: 1234
```

## The project

The project is made by 5 services:

- [server] - Built on top of Node
- [client] - Built on top of React
- [bot] - Built on top of Node
- [postgres] - relational database
- [rabbitmq] - Message Queue

### server

**server** is the backend API/gateway of the application. Is built on top of **Node** and **Express** framework.
It connects with postgres to authenticate and register user and connects to bot to send over a special type of message for queuing.
It creates a websocket communication, using socket.io, with the client for exchanging messages over the chat app.
Server is also the **consumer** of the rabbitmq service.

### client

**client** is the app interface/front-end. Is a **SPA** built on top of **React**. Client uses **Redux** for managing the state of the application. It connects with server through a REST api for authenticating and registering users and throug websockets for exchanging the chat messages.

### bot

**bot** is a service built on top of **Node** and **Express** framework, is called by server when user requests a stock. Bot is the **publisher**, publishiung messages to rabbitmq service.

### postgres

**postgres** relational database used to store user's information.
