mkdir webapp 
cp -R controllers db models routes utils index.js knexfile.js migrate.js package.json package-lock.json awsConfig.js webapp
cp webapp.service webapp/webapp.service
zip -r webapp.zip webapp   
# rm -rf webapp

