## Tetris Game written in vanilla JavaScript

### Build

**Prerequisites**
Ensure docker is preinstalled on your system. Otherwise go to https://docs.docker.com/get-docker/ and follow instructions on the site.


- Goto directory where Dockerfile is placed

`cd tetris`

- Buld a docker image (for example with the name
*tetris-content-nginx*). Note: The last dot is important!
Also you may need to lift the privelege (prefix each command with `sudo`)



`docker build -t tetris-content-nginx .`


- Run the image within a container container *tetris-nginx*:

`docker run --name tetris-nginx -d -p 8080:80 tetris-content-nginx`

- Open your browser and goto http://localhost:8080/tetris

- Enjoy!


### Clean up Docker container

Just execute (you may need to lift the privelege)

`docker stop tetris-nginx -t 1`

`docker rm tetris-nginx`
