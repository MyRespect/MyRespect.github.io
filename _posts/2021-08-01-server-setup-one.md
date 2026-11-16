---
layout: post
title: "Server Setup (1)"
categories: System
tags: ownCloud Gitlab
--- 

* content
{:toc}

In this article, my focus primarily revolves around documenting the procedure for setting up personal servers for ownCloud and Gitlab, aided by the plethora of valuable online resources and blogs available.




### **Gitlab**

GitLab uses Ruby on Rails, an open source version management system, to implement a self-hosted Git project warehouse that can access public or private projects through a web interface. It has similar functionality to Github, with the ability to browse source code and manage defects and comments. Installation reference link: [Gitlab](https://about.gitlab.com/installation/). In fact, the installation process is relatively simple.

Software integration is a link in the software development process. The work in this link generally includes the following processes: merge code--->install dependencies--->compile--->test--->release, software The integration work is detailed and tedious and was previously done manually. But now continuous integration is encouraged (continuous integration is a software development practice, that is, team development members integrate their work frequently, usually each member integrates at least once a day, and each integration is through an automated build), therefore, the continuous integration system should be And born.
GitLab-CI is a continuous integration system used with GitLab. Generally, each project in GitLab will define a software integration script belonging to this project to automatically complete some software integration work. When the warehouse code of this project changes, for example, someone pushes the code, GitLab will notify GitLab-CI of the change. At this time, GitLab-CI will find the Runners associated with this project and notify these Runners to update the code locally and execute the predefined execution script. Therefore, GitLab-Runner is a tool used to execute software integration scripts.

In fact, in addition to Github and Gitlab, there is also Bitbucket as a code warehouse management.

### **ownCloud**

ownCloud is a tool used to create your own private cloud service, which can fully control the data and can be used within a pure LAN. It supports file preview, version control, link sharing, and can also load third-party storage, API support, and more. Both server and client are supported by all platforms. First, you need to install the LAMP suite; then install ownCoud and configure the database.

Reference: [csdnblog](https://blog.csdn.net/And_w/article/details/71238266)  [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-owncloud-on-ubuntu-16-04)

### **IP and DNS**

The network outside the school is really complicated. If you have a company IP, you can only apply for a fixed IP from the operator, otherwise it will be dynamic. You can use peanut shells or router domain names to bind dynamic IP, and then set up the DMZ host. Broadband external network IPs are displayed starting with 10, 100, and 172, and there is no public network IP. The reason is that under the current IPV4, public network IP as a non-renewable resource has been stretched, and there are more and more Internet users and Internet devices, so operators have It is impossible to provide sufficient IP address resources for new users, so operators can only use NAT forwarding technology (network address translation) to put some users in a large LAN and share a small number of external network exits, thereby alleviating IP pressure. , just like a community, you and all residents in the same community share a community gate. The solution is of course to file a complaint or spend more money to fix the IP.

#### **Firewall**
```
sudo ufw app list　//registed a few profiles with ufw
sudo ufw status
sudo ufw allow 'Apache Full'
sudo ufw delete allow 'Apache'
```

#### **Port**

One reason is to prevent hackers, and the other reason is that port 80 is blocked by email...

For the Apache web server:
```
/etc/apache2/ports.conf // change NameVirtualHost *:80 and Listen 80 to our own.
/etc/apache2/sites-available/default // change the VirtualHost :80 to our own e.g., VirtualHost :1000
/etc/init.d/apache2/httpd.conf // add servername localhost

sudo /etc/init.d/apache2 restart 
```

#### **SSL**

To implement https, you need an SSL certificate. Cloud service providers such as Tencent Cloud, Qiniu Cloud, and Alibaba Cloud, but most of them are very expensive. In line with the principle of saving money for the company, I found many ways to make my own certificate, because my 443 port was also blocked. This really made me cry.

Later, I found a [method] for issuing let’s encrypt ssl certificate for non-port 80 that does not support Http verification domain name (https://blog.nbhao.org/2633.html). Finally, it is clear that our problem is to make a [self-signed SSL certificate](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-apache- in-ubuntu-16-04).

```
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/apache-selfsigned.key -out /etc/ssl/certs/apache-selfsigned.crt
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
sudo nano /etc/apache2/conf-available/ssl-params.conf
sudo a2enmod ssl
sudo a2enmod headers
sudo a2ensite default-ssl
sudo a2enconf ssl-params
sudo apache2ctl configtest
```

A new interesting probelm: ERR_SSL_PROTOCOL_ERROR when accessing this server. [Soultion reference](https://stackoverflow.com/questions/34304022/change-ssl-port-of-apache2-server-err-ssl-protocol-error):

I summarize all procedures to set up ssl and changing its port. In this example, I change ssl port to 18443 from 443.

```
sudo apt-get install apache2
sudo a2enmod ssl
sudo a2ensite default-ssl
sudo service apache2 restart
ss -lnt
```
Then, trying to change ssl port:
```
sudo vi /etc/apache2/ports.conf
<IfModule ssl_module>
        Listen 18443
</IfModule>
<IfModule mod_gnutls.c>
        Listen 18443
</IfModule>
```
In this setting, I use default-ssl, so I also have to modify this file.
```
sudo vi /etc/apache2/sites-available/default-ssl.conf
 <IfModule mod_ssl.c>
   <VirtualHost _default_:18443>
```