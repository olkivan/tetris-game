#!/bin/sh
nginx -g 'daemon on;'
cd /srvapi
node ttrsrv.js


