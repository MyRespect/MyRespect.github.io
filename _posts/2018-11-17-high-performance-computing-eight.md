---
layout: post
title: "High Performance Computing (8)"
categories: HPC
tags: openPBS SLURM
--- 

* content
{:toc}

PBS Professional software optimizes job scheduling and workload management in high-performance computing (HPC) environments – clusters, clouds, and supercomputers – improving system efficiency and people’s productivity. Slurm is an open source, fault-tolerant, and highly scalable cluster management and job scheduling system for large and small Linux clusters. Slurm requires no kernel modifications for its operation and is relatively self-contained.




### **openPBS**

#### **Installation**

将openPBS安装到虚拟机CentOS，首先配置Centos:
```
dhclient //设置网络，让centos7自动获取ip地址；
ip addr  //查看IP地址；
yum groupinstall -y "GNOME Desktop" //安装图形化界面, 安装成功后输入init 5, 做一些初始化设置;
```
```
将用户添加到sudo用户组:
sudo的配置文件位于/etc/sudoers, 需要root权限才可以读写，找到root ALL=(ALL) ALL这一行，在后面追加：
"username ALL=(ALL) ALL"，其中username为指定的使用sudo的用户
```
openPBS源代码链接: [pbspro](https://github.com/pbspro/pbspro)
```
yum install -y gcc make rpm-build libtool hwloc-devel libX11-devel libXt-devel libedit-devel libical-devel ncurses-devel perl postgresql-devel python-devel tcl-devel tk-devel swig expat-devel openssl-devel libXext libXft autoconf automake
yum install -y expat libedit postgresql-server python sendmail sudo tcl tk libical
```
安装pbspro遇到了很多坑，这里简单记录一下:
(1) 从source code进行编译安装,能够正常安装，但是无法连接到服务器，centos和ubuntu系统都尝试过了，同样的问题；
(2) 使用官方提供的安装包在centos７安装，缺少依赖组件，但是经过相关包已经安装了．需要进入进入光盘packages，rpm -ivh安装相应缺少的包；
(3) 以上问题的解决办法，使用docker,  参考[链接](https://pbspro.atlassian.net/wiki/spaces/PBSPro/pages/79298561/Using+Docker+to+Instantiate+PBS).
```
sudo docker run -it -h pbs -e PBS_START_MOM=1 pbspro/pbspro bash
qmgr -c "create node pbs"
qmgr -c "set  node pbs queue=workq"
```
#### **Usage**

1. 在主节点上打开PBS服务: /etc/init.d/pbs  start
对于这些PBS的功能开启有几个相同的参量：status 查看状态 restart 重启stop 终止start 开启;

2. 接下来是检查是否可以提交作业pbsnodes –a, 返回free即表示可以提交作业;

3. 写脚本, 命名为pbs_script, PBS作业脚本是一个shell脚本，注释以“#”开头，PBS运行参数以”#PBS“开头，可以直接调用shell命令和系统命令:
```
#!/bin/bash
#PBS -l nodes=5:ppn=4 规定使用的节点数nodes以及每个节点能跑多少核ppn
#PBS –N taskname 任取一作业任务名taskname
#PBS -j oe
cd $PBS_O_WORKDIR 到工作目录下（此为PBS提供的环境变量）
mpirun -np 20 ./fdtd_TE_xyPML_MPI_OpenMP //执行mpirun一句可以用-machinefile或-p4pg 命令参量制定
```
4. PBS有三类命令，用户命令、操作命令、管理员命令:

* 用户命令：qsub, qstat, qdel, qselect, qrerun, qorder, qmove, qhold, qalter, qmsg, qrls
* 操作命令：qenable,qdisable,qrun,qstart,qstop,qterm
* 管理员命令：qmgr,pbsnodes
```
qsub aaa.pbs 提交某作业，系统将产生一个作业id号.
qstat 用于查询作业状态信息, 参数: -f jobid 列出指定作业的信息   -a 列出系统所有作业
qdel -W 15  211    //15秒后删除作业号为211的作业
```

### **SLURM**

1. 安装教程[HERE](https://github.com/MyRespect/ubuntu-slurm).
记录一下安装时遇到的坑:

	1. slurm 可以使用配置参数不同于实际的物理参数，configure FastSchedule=2

	2. 编译安装文件的时候如果配置 ./configure --enable-front-end 
	这种方式不能兼容包含多个外部节点，要么只能一台机器，要么多台！增加外部节点会提示：fatal: Frontend not configured correctly in slurm.con, 当时以为这种方式可以在一台机器上模拟控制节点和计算节点，但是图样图僧袍：使用front-end模式提示，srun task launch not supported on this system，根据此[链接](https://bugs.schedmd.com/show_bug.cgi?id=2349)提示说明：FrontEnd is meant for system like IBM BlueGene or Cray where jobs need some special handling to launch on the system itself, you should not use that here.

2. 节点状态: down 表示故障，drain表示不再分配；sinfo -R : reason why the node is drained.节点状态: down 表示故障，drain表示不再分配；sinfo -R : reason why the node is drained. 如下命令启动系统服务：
```
systemd (optional): enable the appropriate services on each system:
Controller: systemctl enable slurmctld
Database: systemctl enable slurmdbd
Compute Nodes: systemctl enable slurmd
```
3. 因为Edison和TianHe超算都是采用了SLURM调度系统，所以使用方式就不在此赘述了．