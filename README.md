# familydealtree
Supplementary Assessment for CSC7062 Web Development QUB

THE FOLLOWING IS OUT OF DATE AND NEEDS TO BE CHANGED

Instructions on how to run the system locally.

The following two software applications should be installed on the machine that the system will run on:
1. XAMPP if it is a Windows machine, or MAMP if it is an Apple Machine
2. Visual Studio Code

Extract attached zip file titled 'fmasson01.zip'.
Open Apache and click ‘start’ on the Apache service, then click ‘start’ on the MySQL service.
Before progressing, check that MySQL is running on port 3306 on Windows or port 8889 if using a Mac. If using a Mac.
If these do not match the port number needs to be changed manually in Visual Studio Code.
To do this, open the file ‘app.js’ and locate line 34 and change the ‘password’ to ‘root’, then on line 36, change the ‘port’ number to 8889.
Finally, click ‘Admin’ on the MySQL service.
The phpMyAdmin server should be opened by clicking ‘Admin’ on the MySQL service - this will open phpMyAdmin in a new tab in your browser.
In the left column, click 'new' to create a new database.
In the field ‘Database name’ type ‘40200272’ and click the ‘create’ button.
Locate the new 40200272 database which has now been created by clicking on the name in the left column.
From the top menu, select ‘Import’. On this page select the ‘choose file’ button and navigate to where ‘40200272.sql’ is located in your system files.
In Visual Studio Code, create a new terminal by clicking ‘Terminal’ and selecting ‘New Terminal’.
Alternatively, this can also be achieved using the shortcut Ctrl+Shift+’
In the new terminal that has just been created, type in the command: npm install node –save-dev
To run the server, type in the command ‘node app’ and press the enter key
To render the website, open the Google Chrome browser and type the following url into the address bar: ‘http://localhost:3000’.
You can now use the website.
