#!/bin/bash
set -xe

# Start Tomcat, the application server.
sudo systemctl enable webapp.service 
sudo systemctl start webapp.service