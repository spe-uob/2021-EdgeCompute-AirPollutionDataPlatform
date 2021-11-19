# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.

CKAN_API_KEY = ""

Vagrant.configure("2") do |config|  
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://vagrantcloud.com/search.
  config.vm.box = "ubuntu/focal64"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # NOTE: This will enable public access to the opened port
  # config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"

  config.vm.hostname = "ckan.apdf.local"
  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: "192.168.56.0"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  config.vm.synced_folder "./ckan_data_imports", "/data_imports"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider "virtualbox" do |vb|
    # Display the VirtualBox GUI when booting the machine
    vb.gui = true
  
    # Customize the amount of memory on the VM:
    # vb.memory = "1024"
  end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Enable provisioning with a shell script. Additional provisioners such as
  # Ansible, Chef, Docker, Puppet and Salt are also available. Please see the
  # documentation for more information about their specific syntax and use.
  config.vm.provision "shell", inline: <<-SHELL
    export DEBIAN_FRONTEND=noninteractive

    apt-get update
    apt-get install -y python3-pip
    pip3 install requests ckanapi
    pip3 install python-dateutil
    sudo apt-get install -y r-base

    # Install the CKAN package
    sudo apt-get install -y libpq5 redis-server nginx supervisor
    wget https://packaging.ckan.org/python-ckan_2.9-py3-focal_amd64.deb
    sudo dpkg -i python-ckan_2.9-py3-focal_amd64.deb

#   Install and configure PostgreSQL
    sudo apt-get install -y postgresql
    sudo -u postgres psql -c "CREATE USER ckan_default WITH PASSWORD 'pass';"
    sudo -u postgres psql -c "CREATE USER datastore_default WITH PASSWORD 'pass';"
    sudo -u postgres createdb -O ckan_default ckan_default -E utf-8
    sudo -u postgres createdb -O datastore_default datastore_default -E utf-8


#   Install and configure Solr and DataStore
    sudo apt-get install -y solr-tomcat
    sudo sed -ie 's+<Connector port="8080" protocol="HTTP/1.1"+<Connector port="8983" protocol="HTTP/1.1"+g' /etc/tomcat9/server.xml
    sudo mv /etc/solr/conf/schema.xml /etc/solr/conf/schema.xml.bak
    sudo ln -s /usr/lib/ckan/default/src/ckan/ckan/config/solr/schema.xml /etc/solr/conf/schema.xml
    sudo service tomcat9 restart
    sudo sed -ie 's+#solr_url = http://127.0.0.1:8983/solr+solr_url=http://127.0.0.1:8983/solr+g' /etc/ckan/default/ckan.ini
    sudo sed -ie 's+ckan.site_url =+ckan.site_url=http://ckan.apdf.local+g' /etc/ckan/default/ckan.ini
    sudo sed -ie 's+ckan.plugins = stats text_view image_view recline_view+ckan.plugins = stats text_view image_view recline_view datastore+g' /etc/ckan/default/ckan.ini

    ckan -c /etc/ckan/default/ckan.ini sysadmin add admin email=admin@localhost name=admin
    sudo sed -ie 's+#ckan.datastore.write_url = postgresql://ckan_default:pass@localhost/datastore_default+ckan.datastore.write_url = postgresql://ckan_default:pass@localhost/datastore_default+g' /etc/ckan/default/ckan.ini
    sudo sed -ie 's+#ckan.datastore.read_url = postgresql://datastore_default:pass@localhost/datastore_default+ckan.datastore.read_url = postgresql://datastore_default:pass@localhost/datastore_default+g' /etc/ckan/default/ckan.ini
    sudo ckan /etc/ckan/default/ckan.ini datastore set-permissions | sudo -u postgres psql --set ON_ERROR_STOP=1

    sudo ckan db init
    sudo supervisorctl reload
    sudo service nginx restart

    SHELL
end
