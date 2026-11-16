---
layout: post
title: "Server Setup (2)"
categories: "System"
tags: Docker
--- 

* content
{:toc}

Docker serves as an open platform, enabling developers and system administrators to construct, transport, and execute distributed applications, whether they are on laptops, virtual machines in data centers, or in the cloud.




###  **Installation**

Using Docker, developers package their applications and dependencies into a lightweight, portable container, and then publish it to any popular Linux machine, which can be virtualized and has extremely low container performance overhead. Docker images include Running environment and configuration, so Docker can simplify the deployment of multiple application instances. For example, web applications, background applications, database applications, big data applications such as Hadoop clusters, message queues, etc. can be packaged into a mirror for deployment.

Install Docker on Centos: [Centos](http://www.runoob.com/docker/centos-docker-install.html)
Install Docker on Ubuntu: [Ubuntu](http://www.runoob.com/docker/ubuntu-docker-install.html)
```
uname -r // check kernel version
wget -qO- https://get.docker.com/ | sh　// download installation package
sudo usermod -aG docker runoob 　// commands prompted to enter after installation is complete
sudo service docker start　//start docker service, or using sudo systemctl start docker
docker ps -a　// query container
```

### **Usage**

* "docker run" is only used when running for the first time. Put the image in the container. To start the container again in the future, you only need to use docker start (start the existing image, but you cannot specify the instructions to run when the container starts). , docker run is equivalent to performing two steps, placing the image in the container (docker create), and then starting the container to turn it into a runtime container (docker start).

* When using docker run to create a container, the standard operations Docker runs in the background include:

	* Check whether the specified image exists locally. If not, download it from the public warehouse.
	* Use the image to create and start a container.
	* Allocate a file system and mount a read-write layer outside the read-only image layer.
	* Bridge a virtual interface from the bridge interface configured on the host host to the container.
	* Configure an IP address from the address pool to the container.
	* Execute user-specified applications.
	* The container is terminated after execution is completed.

* You need to ensure that the container is stopped before deleting it. Use the stop command. Please note that the commands for deleting images and containers are different. docker rmi ID, where container (rm) and image (rmi).

* Because the ID of the container is a random code, and the name of the container is a seemingly meaningless naming, we can use the command:

	```
	docker rename  old_name new_name

	docker [stop] [start]  new_name // we can use new name now
	```

* List the images on the machine: docker images

* Pull down the image or repository from the docker registry server (pull), push an image or repository to the registry (push), corresponding to pull
```
docker pull centos:centos6 // Officical Image
docker pull username/repository<:tag_name> // Personal Image
docker pull seanlook/centos:centos6
```
* Use image to create a container and enter interactive mode, login shell is /bin/bash
```
sudo docker run -it -h pbs –-name pbs -e PBS_START_MOM=1 pbspro/pbspro bash // -i: interactive mode, -t: allocate pseudo terminal, -h: give hostname, --name give a name;
sudo docker  --privileged -p 8817:6817 -p 8818:6818 --dns 8.8.8.8 --dns 8.8.4.4 -h controler --name slurm_control1  -i -t run ubuntu:16.04 /bin/bash
sudo docker run -h controler --name slurm_control1  -i -t ubuntu:16.04 /bin/bash
```
* Mapping host to container port and directory: -p <host_port:contain_port>
```
-p 127.0.0.1:127.0.0.1:11211:11211 // Only bind port 11211 of the localhost interface
-p 11211:11211　// This is the default situation, binding the 11211 port of all network cards (0.0.0.0) of the host to the 11211 port of the container.
```
* Solidify a container into a new image:
```
docker commit <cotainer> [repo:tag]
docker commit -m "some tools installed" fcbd0a5348ca seanlook/ubuntu:14.10_tutorial
```
* To install software in docker, you need apt update to install the software after entering the terminal. The container installed by Docker's Ubuntu image does not have the ifconfig command and the ping command to solve the problem:
```
apt-get update
apt install net-tools       // ifconfig 
apt install iputils-ping     // ping
```
* Execute the command on the host machine to copy the file to docker
```
docker cp // The file path to be copied and the container name: must be assigned to the corresponding path in the container;
```