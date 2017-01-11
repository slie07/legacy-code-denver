set -e

sudo apt-get update
sudo apt-get install libpq-dev python-dev  postgresql postgresql-client libffi-dev node npm openjdk-7-jdk --assume-yes

git clone https://username@bitbucket.org/svankina/senseus.git

#install pip:
#download get-pip.py from the website and run it:
wget https://bootstrap.pypa.io/get-pip.py
sudo python get-pip.py

sudo pip install virtualenvwrapper

#Add environment variables
echo "
export WORKON_HOME=$HOME/.virtualenvs
export PROJECT_HOME=$HOME/Devel
source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bashrc

source ~/.bashrc

#Set up virtual environment
mkvirtualenv sensus
workon sensus

#Install requirements
cd senseus
pip install -r pip-requirements.txt

#Set up DB

#Sometimes, a restart or running of `/etc/init.d/postgresql start` is necessary to run below commands

sudo -u postgres psql
CREATE USER senseus WITH PASSWORD 'senseus';
ALTER ROLE senseus SUPERUSER;
\q

sudo -u postgres psql postgres -f database/create_db.sql

sudo npm install -g ionic cordova bower gulp

#From here you can simply run the app by doing:
#This will launch the app in your default browser with live reloads.
#cd sensus/ionic/sensus
#ionic serve

#Run the backend server as usual:
#cd senseus
#python server.py


#Stuff to setup and run on android.
#mkdir ~/my_apps
#cd ~/my_apps
#wget http://dl.google.com/android/android-sdk_r24.3.4-linux.tgz
#tar -xvf android-sdk_r24.3.4-linux.tgz

#echo "export PATH=$PATH:$HOME/android-sdk-linux/tools:$HOME/android-sdk-linux/platform-tools" >> ~/.bashrc

#. ~/.bashrc

##Install android 22 here.
#android

#To build ionic for android
#cd senseus/ionic/sensus
#ionic platform add android
#ionic build

#After this, run android avd to create an emulator.

#ionic run will now run stuff on emulator or on device conected via usb.

