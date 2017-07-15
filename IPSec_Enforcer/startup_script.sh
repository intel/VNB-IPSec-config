#!/bin/sh

# Fetch all the latest services
echo "=========================Installing dependencies=================================="
apt-get -y update

# Install dependencies for SecMon EMS server
apt-get -y --force-yes install python-pip 
apt-get -y --force-yes install python-dev
apt-get -y --force-yes install libldap2-dev
apt-get -y --force-yes install libsasl2-dev
apt-get -y --force-yes install libssl-dev 

pip install -r requirements_ipsecenforcer.txt

echo "========================Copying IPsec Enforcer /etc/=============================="
rm -rf /etc/ipsec_enforcer
cp -rf ipsec_enforcer /etc/ipsec_enforcer

echo "========================Starting Consul Service==============================="
sudo update-rc.d -f /etc/init.d/ipsecenforcer remove
service ipsecenforcer stop
rm /etc/init.d/ipsecenforcer

cp ipsecenforcer /etc/init.d/
chmod +x /etc/init.d/ipsecenforcer

#Update rc run-levels
sudo update-rc.d ipsecenforcer defaults 
service ipsecenforcer start

