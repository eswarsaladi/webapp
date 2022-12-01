#!/bin/bash
set -xe

sudo sh -c 'apt-get update -y'
sudo sh -c 'apt-get upgrade -y'

cd /home/ubuntu
rm -rf webapp