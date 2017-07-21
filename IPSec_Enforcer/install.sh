#!/bin/bash

current_dir=`pwd`

function install_dep {
	cd $current_dir
    apt-get -y update
    
    echo "Installing dependencies..."
	echo "Installing required linux packages..."
    # Install dependencies for SecMon EMS server
    apt-get -y --force-yes install python-pip 
    apt-get -y --force-yes install python-dev
    apt-get -y --force-yes install libldap2-dev
    apt-get -y --force-yes install libsasl2-dev
    apt-get -y --force-yes install libssl-dev
    apt-get -y install build-essential libgmp-dev libunbound-dev libldns-dev
	echo "Installing required linux packages...done"

	echo "Fetching Strongswan 5.3.5..."
	wget --no-check-certificate https://download.strongswan.org/strongswan-5.3.5.tar.gz
	echo "Fetching Strongswan 5.3.5...done"
	
	echo "Building Strongswan 5.3.5..."
	tar -xvzf strongswan-5.3.5.tar.gz
	rm -rf strongswan-5.3.5.tar.gz
	cd strongswan-5.3.5/
	./configure --prefix=/usr --sysconfdir=/etc
	make
	echo "Building Strongswan 5.3.5...done"
	
	echo "Installing Strongswan 5.3.5..."
	sudo make install
	sudo ipsec start
	echo "Installing Strongswan 5.3.5...done"

	echo "Installing required python packages..."
	cd $current_dir
    pip install -r requirements_ipsecenforcer.txt
	echo "Installing required python packages...done"
	echo "Installing dependencies...done"
}

function configure_ipsecenforcer {
	echo "Configuring IPsec Enforcer..."
    CONFIG_FILE=ipsec_enforcer/registration/ipsecenforcer.ini
    cd $current_dir

    echo -n "Enter the type (group/local): "
    read choice

    echo "[ENDPOINT]" > $CONFIG_FILE
    if [ $choice == "group" ]
    then
        echo -n "Enter group name: "
        read name
        echo "NAME_AND_TYPE = ($name, group)" >> $CONFIG_FILE 
    elif [ $choice == "local" ]
    then
        echo -n "Enter localsite name: "
        read name
        echo "NAME_AND_TYPE = ($name, localsite)" >> $CONFIG_FILE 
    else
        echo "invalid option"
    fi
    
    echo "" >> $CONFIG_FILE    
    echo "[INTERFACE]" >> $CONFIG_FILE

    echo -n "IPsec Tunnel Interface (ethX): "
    read tun_intf
    echo "IPSEC_TUNNEL_INTERFACE = $tun_intf" >> $CONFIG_FILE
    
    echo -n "IPsec EMS Interface (ethX): "
    read ems_intf
    echo "IPSEC_EMS_INTERFACE = $ems_intf" >> $CONFIG_FILE

    echo "" >> $CONFIG_FILE    
    echo "[IPSEC_EMS_CONTROLLER]" >> $CONFIG_FILE
    echo -n "IPsec EMS Controller address with port: "
    read ems_ip
    
    echo "IP_ADDRESS_WITH_PORT = $ems_ip" >> $CONFIG_FILE
    echo "" >> $CONFIG_FILE
    
    echo "[IPSEC_EMS]" >> $CONFIG_FILE
    echo "IP_ADDRESS_WITH_PORT = $ems_ip" >> $CONFIG_FILE
	echo "Configuring IPsec Enforcer...done"
}


function run_ipsecenforcer {
	echo "Running IPsec Enforcer..."
	cd $current_dir
    cd ipsec_enforcer
    nohup python manage.py runserver 0.0.0.0:8001 &
    sleep 2
    nohup python manage.py ipsecenforcer_agent &
	echo "Running IPsec Enforcer...done"
}

# loop for user input
while true; do
  echo "Choose operation you want to perfrom"
  echo "1.  Install Dependencies"
  echo "2.  Configure IPsec Enforcer"
  echo "3.  Run IPsec Enforcer"
  echo

  echo -n "Enter you choice, or 0 for exit: "
  read choice
  echo 

  case $choice in
    1)
      install_dep
      ;;
    2)
      configure_ipsecenforcer
      ;;
    3)
      run_ipsecenforcer
      ;;
    0)
      echo "exiting.... bye"
      break
      ;;
    *)
      echo "Invalid choice, try a number from 0 to 3"
      ;;
esac
done
