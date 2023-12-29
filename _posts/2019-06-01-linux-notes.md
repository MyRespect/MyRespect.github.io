---
layout: post
title: "Linux Notes"
categories: System
tags: Linux
--- 

* content
{:toc}

Linux has become a popular choice for servers, embedded systems, and a wide range of computing devices, offering a powerful and customizable environment for users and developers. Considering many commands are used in Linux, in this post, I mainly make some notes when I use the Linux system.




### **VM startup**

```
vmrun start "/home/myrespect/vmware/Ubuntu 64-bit (2)/Ubuntu 64-bit (2).vmx"
```
Script setup [reference](https://www.atrixnet.com/autostart-vmware-virtual-machines-on-boot-in-linux/). Configure vm to start automatically:
```
sudo update-rc.d vmware-autostarts defaults //script file vmware-autostarts
update-rc.d -f ＜basename＞ remove　// update-rc.d is a script used to update system startup items. The corresponding script is located in the /etc/init.d/ directory
```

### **tmp dir**

Prevent the files saved in the tmp directory from disappearing after restarting the system in Ubuntu system:

1. Open the terminal

2. The cd command enters /etc/default in sequence.

3. Modify rcS with root permission: sudo chmod 0666 rcS;

4. Select E in vim/vi to enter rcS, edit rcS, and change TMPTIME=0 to =-1;

### **source and sh**

source filepath使得当前shell读入路径为filepath的shell文件,并依次执行文件中的语句，使之立即生效．

sh filepath会重新建立一个子shell，在子shell中执行脚本里面的语句，该子shell继承父shell的环境变量，但子shell是新建的，其改变的变量不会被带回父shell，除非使用export．

### **fpm**

fpm打包工具
```
gem install fpm
fpm -s dir -t deb -v 1.0 -n slurm-17.02.6 --prefix=/usr -C /tmp/slurm-build .
```
-s 指定源类型(支持的源类型包，dir, rpm, gem, python)
-t 指定目标类型(指定目标类型rpm, deb, solaris, puppet)
-v 指定包的版本号
-C指定打包的相对路径
-n 指定包的名字

### **cpu and mem**
```
查看cpu: lscpu
查看usb: lsusb
查看内存: free
查看内存: htop
系统内核: uname -a
每秒显示nvidia-gpu的使用: watch -n 1 nvidia-smi
清空当前登录终端的历史命令: history -c
读取存放记录的文件, history -r ~/.bash_history
ubuntu查看cuda版本, cat /usr/local/cuda/version.txt  nvcc -V
CPU占用最多的前10个进程: 
ps auxw|head -1;ps auxw|sort -rn -k3|head -10
内存消耗最多的前10个进程:
ps auxw|head -1;ps auxw|sort -rn -k4|head -10
```
MEM 进程的内存占用率, VSZ 进程所使用的虚存的大小, RSS 进程使用的驻留集大小或者是实际内存的大小(RSS is the "resident set size" meaning physical memory used), TTY 与进程关联的终端.

### **find and grep**

在使用linux时进行文件查找, 主要由find和grep命令:

* find命令是根据文件的属性进行查找, 比如文件名(-name), 文件大小(-size), 所有者(-user), 所属组(-group), 是否为空(-empty),访问时间(-atime), 修改时间(-mtime);
```
find / -name httpd.conf #从根目录下查找文件httpd.conf
find / -user Jason      #查找系统中属于Jason这个用户的文件
```
* grep 是根据文件的内容进行查找, 会对文件的每一行按照给定的模式进行正则匹配查找:
正则表达式主要参数:
```
.　匹配所有的单个字符
[A-Z]　指定范围
\　转义字符，忽略正则表达式中特殊字符的原有含义
*　匹配任意长度字符,长度可以为0
```
grep文件内容查找:
```
grep expression -i #-i 不区分大小写, -n显示匹配行和行号, -c显示匹配的文本行总数
grep ‘test’ d*     #显示所有以d开头的文件中包含test的行
grep magic /usr/src #显示/usr/src/目录下的文件(不包含子目录)包含magic 的行
grep -nr magic /usr/src  #包含子目录, 且显示匹配行和行号
```
ps和grep搭配查看系统进程:
```
ps -aux | grep "test.sh"  #a:显示所有程序 u:以用户为主的格式来显示 x:显示所有程序，不以终端机来区分
ps -fA | grep python      #A:显示所有进程 f:显示UID, PPIP栏位
ps -ef　|　grep mysqld #看看是否有mysqld_safe 和mysqld进程
```

### **netcat**

nc: netcat是linux下的一个用于调试和检查网络工具包，可用于创建TCP/IP连接，最大的用途就是用来处理TCP/UDP套接字，netcat工具用于服务器模式，可以监听指定端口，nc -l 2389　然后可以用客户端模式连接到2389端口，nc localhost 2389,　如果你现在你输入一些文本，它将发送到服务器端．

端口扫描: nc -v -w 3 10.1.50.58 -z 23-28

-v 表示详细输出，-w seconds timeout的时间，-z 将输入输出关掉，用于扫描时，其中端口号可以指定一个范围．-k参数控制让服务器不会因为客户端的断开连接而退出

文件拷贝
启动监听：nc -l 9999 >tmp.txt
传送文件：nc localhost 9999 < .bashrc
查看文件：cat tmp.txt

### **touch**

touch 命令:用于把已存在的文件的时间标签更新为系统当前的时间, 数据不会被修改; 还可以用来创建新文件;touch -d <时间日期> 使用指定的日期时间, 而非现在的时间;

### **output redirection**

bin/run-example SparkPi 2>&1 | grep "Pi is"
#命令中的 2>&1 可以将所有的信息都输出到 stdout 中，否则由于输出日志的性质，还是会输出到屏幕中;

/dev/null 表示空设备文件
0 表示stdin标准输入
1 表示stdout标准输出
2 表示stderr标准错误

command 1>a 2>&1: &1的含义就可以理解为用标准输出的引用，引用的就是重定向标准输出产生打开的a

### **cmake**

cmake 是一种跨平台编译工具, 主要是编写CMakeList.txt文件, 然后用cmake命令将CMakeLists.txt文件转化为make所需要的makefile文件, 最后用make命令编译源码生成可执行程序或共享库. 
cmake  指向CMakeLists.txt所在的目录,一般建议新建一个新的目录，专门用来编译:
```
mkdir build
cd build
cmake ..
make
```
### **qmake**

Linux 下的hello.pro文件的写法:
```
#指定源文件，指定头文件，指定目标文件名　
SOURCES = hello.cpp /
          main.cpp 
HEADERS += hello.h
TARGET = filename

CONFIG用来告诉qmake关于应用程序的配置信息

平台相关性处理，如果qmake运行在Windows上的时候，它就会把hello_win.cpp添加到源文件列表中，否则忽略;
win32 {
SOURCES += hello_win.cpp
}

有了hello.pro文件后生成Makefile

qmake -o Makefile hello.pro
```

### **screen and virtualenv**

```
screen -S yourname 新建一个yourname的会话， 
screen -r yourname 返回一个yourname的会话
screen -ls 列出所有会话
screen -d 执行detach 在保证里面的程序正常运行的情况下让screen 挂起

virtualenv virtual
source virtual/bin/activate 
deactivate 
pip freeze -> requirement.txt 
pip install -r requirement.txt
pip list 查看环境下的pip包
```

### **anaconda**

```
conda install -c jjhelmus tensorflow-base
conda create -n (name)
source activate basename
source deactivate  basename
conda remove -n (name) –all
conda info -e # check the installed environment
```



### **git**

```
sudo apt-get install git
sudo apt-get install openssh-server openssh-client //然后可以ssh-keygen避免每次输入密码
sudo useradd git　　　//useradd 和 adduser有区别,其实推荐adduser
sudo passwd git
sudo mkdir /home/git/repositories //创建git仓库存储目录和权限
sudo chown git:git /home/git/repositories
sudo chmod 755 /home/git/repositories
su git
cd  /home/git/repositories
git init --bare gitName.git

git status
git add -A  # Add all new and changed files to the staging area
git commit -m "[commit message]"    # Commit changes
git push -u origin [branch name]    # Push changes to remote repository (and remember the branch)
git diff file # Preview changes before merging
git checkout # Switch to a branch and discard the changes
git reset HEAD file # Discard changes in staging area
```
Git submodule允许将一个Git仓库当作另外一个Git仓库的子目录。这允许克隆另外一个仓库到你的项目中并保持你的提交相对独立。
首先你要把外部的仓库克隆到子目录中。你通过git submodule add将外部项目加为子模块;

### **ssh-server**

```
sudo apt-get install openssh-server
sudo service ssh start
ssh-keygen -t rsa
ssh-copy-id -i ~/.ssh/id_rsa.pub name@192.168.1.100
```

### **others**

* 可以用hostname 进行DNS解析，对/etc/hosts文件进行ip地址和hostname映射

* GID: 组ID,用来标识用户组的唯一标识符; UID：用户ID,用来标识每个用户的唯一标识符

* Linxu下的ldd命令用于打印程序或者库文件所依赖的共享库列表

* gnupg是加密软件的集合, gpg -c file.txt 加密文件, rm file.txt 删除文件, gpg file.txt.gpg解密文件

* bash script

```
This_DIR=$(cd $(dirname $0); pwd)
DATA_DIR=${THIS_DIR}/../data
mkdir -p “$DATA_DIR”

tar -zxf file.tar.gz -C /usr/local/ #-C: 指定解压到的文件路径
```