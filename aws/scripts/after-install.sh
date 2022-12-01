#!/bin/bash
set -xe


# Copy war file from S3 bucket to tomcat webapp folder
aws s3 cp s3://myvpc123-webappdeploymentbucket-lzw09rpnddrl/webapp.zip /home/ubuntu/webapp.zip 
cd home/ubuntu
unzip webapp.zip


cd webapp && npm install 

sudo cp /home/ubuntu/webapp/cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2  -c file:/opt/aws/amazon-cloudwatch-agent/etc/cloudwatch-config.json -s