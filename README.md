# Thread Front End

### Before you start

This project is the front end part of our mongodb project.  
For this to work, you will also need to have a server running and have it connected to [mongodb](https://www.mongodb.com/).  
The repo for our server is located here [thread-back-end](https://github.com/alexsophiekim/thread-front-end).  

## Installation
To install everything needed for this project, you need to have a stable version of Node JS and NPM installed on your computer or server.

### Clone and install the front-end project
```sh
$ git clone https://github.com/alexsophiekim/thread-front-end
$ cd thread-front-end
$ npm install
```
You also need to create a **config.json** file and include the following lines.  
The URL and port need to be the ones used to run your node server.

```json
{
  "SERVER_URL": "",
  "SERVER_PORT": ""
}
```
