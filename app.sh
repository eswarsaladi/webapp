# upgrading the libraries
sudo apt-get update
sudo apt-get upgrade -y  

# installing dependencies

sudo apt install -y gcc-c++ make
sudo apt-get install -y nodejs unzip npm wget
# sudo apt install npm postgresql postgresql-contrib unzip -y 
# # starting postgres
# sudo systemctl start postgresql.service  

sudo npm cache clean -f
sudo npm install -g n
sudo n 16

# setup database
# sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
# sudo -u postgres psql -c "CREATE DATABASE webapp;" 
wget https://s3.us-east-1.amazonaws.com/amazoncloudwatch-agent-us-east-1/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

cd ~/ && unzip webapp.zip
cd webapp



npm install


sudo ln -s ~/webapp/webapp.service /lib/systemd/system/webapp.service
sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service

 sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/home/ubuntu/webapp/cloudwatch-config.json \
    -s
 
