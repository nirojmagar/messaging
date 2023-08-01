<h2 align="center">
  Message Queue Demo
</h2>

## Description
<p align="center">
    This demo project is using nestjs, a nodejs framework for backend and react js for frontend as mentioned. And also using kafka with zookeper for message queue and socket.io for client and backend communication and a nginx server for frontend deployment. 
    There is a simple authentication using static token for frontend and backend communication. 
    users can enter the message on their own or can auto generate messages.
</p>

## Installation

```bash
# build and run all instances
$ docker-compose up --build
```

## Deployments
<ul>
<li><a href="http://localhost:3000" target="_blank">Message Producer Backend - localhost:3000</a></li>
<li><a href="http://localhost:3001" target="_blank">Message Consumer Backend - localhost:3001</a></li>
<li><a href="http://localhost" target="_blank">Frontend - localhost ( port 80)</a></li>
</ul>

## File System
    .
    ├── backend-producer  #reveives messages 
    ├    ├── dist          #compiled source
    ├    ├── src
    ├    ├── test
    ├── backend-comsumer   # sends messages
    ├    ├── dist          #compiled source
    ├    ├── src
    ├    ├── test
    ├── frontend     # send and receives messages
    ├    ├── build    #compiled source
    ├    ├── src
    ├    ├── test
    └── README.md
