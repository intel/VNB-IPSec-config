#!/bin/bash

current_dir=`pwd`
cert_path="/etc/apache2/ssl"

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

    	# change log folder permission
    	sudo chown :www-data -R common/logs

	# changes for HTTPS communication
	# installing apache2 and mod wsgi module
	echo "Installing apache2..."
	sudo -E apt-get -y install apache2 libapache2-mod-wsgi
	echo "Installing apache2...done"

	# configuring SSL related configurations
    	# Change apache2.conf
    	sudo cp apache_configurations/apache2.conf /etc/apache2/apache2.conf
    	sudo sed -i -e 's-${PROJECT_ROOT}-'"$current_dir"'-g' /etc/apache2/apache2.conf

    	# move default-ssl to standard path
    	sudo cp apache_configurations/default-ssl.conf /etc/apache2/sites-available/default-ssl.conf

    	# change current directory inside default-ssl file
    	sudo sed -i -e 's-${PROJECT_ROOT}-'"$current_dir"'-g' /etc/apache2/sites-available/default-ssl.conf

    	# change certificate path inside default-ssl file
    	sudo sed -i -e 's-${CERT_PATH}-'"$cert_path"'-g' /etc/apache2/sites-available/default-ssl.conf

    	# configuring HTTP related confs
    	sudo cp apache_configurations/000-default.conf /etc/apache2/sites-available/000-default.conf

    	# change current directory inside 000-default file
    	sudo sed -i -e 's-${PROJECT_ROOT}-'"$current_dir"'-g' /etc/apache2/sites-available/000-default.conf

    	# Enable apache wsgi module
    	sudo a2enmod wsgi

    	# Enable apache SSL module
    	sudo a2enmod ssl

    	# Enable SSL configurations
    	sudo a2ensite default-ssl

    	sudo service apache2 restart
}


function run_ipsecems {
	echo "Running IPsec EMS Services..."
	cd $current_dir
    	nohup ./consul agent -server -bootstrap-expect 1 -data-dir consul_data -node=agent-one -config-dir consul.d -advertise=127.0.0.1 &
    	cd $current_dir/rbac/
    	nohup python manage.py runserver localhost:8051 &
    	sleep 2
    	cd $current_dir/common/
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
