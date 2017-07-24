#!/bin/bash

current_dir=`pwd`

function install_dep {
	cd $current_dir
    	sudo -E apt-get -y update

	echo "Installing required linux packages..."
    	# Install dependencies for SecMon EMS server
    	sudo -E apt-get -y --force-yes install python-pip 
    	sudo -E apt-get -y --force-yes install python-dev
    	sudo -E apt-get -y --force-yes install libldap2-dev
    	sudo -E apt-get -y --force-yes install libsasl2-dev
    	sudo -E apt-get -y --force-yes install libssl-dev 
	echo "Installing required linux packages...done"

	echo "Installing required python packages..."    
    	sudo -E pip install -r common/requirements_ipsecems.txt
    	sudo -E pip install -r rbac/requirements_ipsecems_rbac.txt
	echo "Installing required python packages...done"

	echo "Fetching consul database exectuable..."
    	wget --no-check-certificate https://releases.hashicorp.com/consul/0.6.4/consul_0.6.4_linux_amd64.zip
    	unzip consul_0.6.4_linux_amd64.zip
    	rm consul_0.6.4_linux_amd64.zip
	echo "Fetching consul database exectuable...done"

	echo "Creating directories for consul database..."
    	mkdir -p consul_data
    	mkdir -p consul.d
	echo "Creating directories for consul database...done"
}


function run_ipsecems {
	echo "Running IPsec EMS Services..."
	cd $current_dir
    	nohup ./consul agent -server -bootstrap-expect 1 -data-dir consul_data -node=agent-one -config-dir consul.d -advertise=127.0.0.1 & 
    	cd $current_dir/rbac/
    	nohup python manage.py runserver localhost:8051 &
    	sleep 2
    	cd $current_dir/common/
    	nohup python manage.py runserver 0.0.0.0:8000 &
    	nohup python manage.py healthcheck &
    	nohup python manage.py ipsecenforcernotify &
    	nohup python manage.py rbacregister &
    	sleep 2
	echo "Running IPsec EMS Services...done"
}

# loop for user input
while true; do
  	echo "Choose operation you want to perfrom"
  	echo "1.  Install Dependencies"
  	echo "2.  Run IPsec EMS"
  	echo

  	echo -n "Enter you choice, or 0 for exit: "
  	read choice
  	echo 

  	case $choice in
  	  1) 
  	    install_dep
  	    ;;
  	  2)   
  	    run_ipsecems
  	    ;;
  	  0)
  	    echo "exiting.... bye"
  	    break
  	    ;;
  	  *)
  	    echo "Invalid choice, try a number from 0 to 2"
  	    ;;
esac
done
