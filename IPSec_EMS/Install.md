# **IPsec EMS Setup Steps**
==================================

## Install Dependencies
--------------------

1.  Install packages used by IPsec EMS server. Like **Django Framework,
    python-consul, Django Rest Framework and etc**.
```
    cd <repo_name>
    apt-get -y update
    apt-get -y --force-yes install python-pip
    apt-get -y --force-yes install python-dev
    apt-get -y --force-yes install libldap2-dev
    apt-get -y --force-yes install libsasl2-dev
    apt-get -y --force-yes install libssl-dev
    pip install -r common/requirements_ipsecems.txt
    pip install -r rbac/requirements_ipsecems_rbac.txt
```

2.  Fetch **consul** distributed database binary from hashicorp website.
```
    cd <repo_name>
    wget --no-check-certificate
    https://releases.hashicorp.com/consul/0.6.4/consul_0.6.4_linux_amd64.zip
    unzip consul_0.6.4_linux_amd64.zip
    rm consul_0.6.4\_linux_amd64.zip
```

3.  Create folder to store **consul** database files.
```
    cd <repo_name>/
    mkdir -p consul_data
    mkdir -p consul.d
```

4.  Change permission of log folder
```
    sudo chown :www-data -R common/logs
```

5.  Install Apache web server and Apache wsgi module.
```
    sudo -E apt-get -y install apache2 libapache2-mod-wsgi
```

6.  Configure SSL related Apache configurations.
```
    sudo cp apache_configurations/apache2.conf /etc/apache2/apache2.conf
    sudo sed -i -e 's-${PROJECT_ROOT}-'"$current_dir"'-g' /etc/apache2/apache2.conf
    sudo cp apache_configurations/default-ssl.conf /etc/apache2/sites-available/default-ssl.conf
    sudo sed -i -e 's-${PROJECT_ROOT}-'"$current_dir"'-g' /etc/apache2/sites-available/default-ssl.conf
    sudo sed -i -e 's-${CERT_PATH}-'"$cert_path"'-g' /etc/apache2/sites-available/default-ssl.conf
```

7. Configure HTTP related configurations for Apache web server.
```
    sudo cp apache_configurations/000-default.conf /etc/apache2/sites-available/000-default.conf
    sudo sed -i -e 's-${PROJECT_ROOT}-'"$current_dir"'-g' /etc/apache2/sites-available/000-default.conf
```

8. Enable Apache web server.
```
   sudo a2enmod wsgi
   sudo a2enmod ssl
   sudo a2ensite default-ssl
   sudo service apache2 restart
```

Run IPsec EMS Server
--------------------

1.  Start **consul** database server in bootstrap mode in background.
```    
    cd <repo_name>/
    nohup ./consul agent -server -bootstrap-expect 1 -data-dir
    consul_data -node=agent-one -config-dir consul.d -advertise=127.0.0.1 &
```

1.  Start **RBAC** server in background. Which will manage user and
    their respective roles.
```    
    cd <repo_name>/rbac/
    nohup python manage.py runserver localhost:8051 &
```

2.  Start **IPsec EMS** server in background. Which will communicate
    with **RBAC** server and server GUI pages to user.
```    
    cd <repo_name>/common/
    nohup python manage.py healthcheck &
    nohup python manage.py ipsecenforcernotify &
    nohup python manage.py rbacregister &
```

