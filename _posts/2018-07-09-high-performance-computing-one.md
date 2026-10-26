---
layout: post
title:  "High Performance Computing (1)"
categories: HPC
tags: Edison TianHe
--- 

* content
{:toc}

In the following series of blogs, I will introduce the application of high-performance computing. In this blog, I will introduce the basic usage of supercomputers: Edison in the USA and Tianhe in China.




### **Edison**

The official website for Edison Supercomputer is [NERSC](http://www.nersc.gov/). Using Edison is not so complicated, just like a remote server. Use ssh to connect to Edison, scp/sftp for external data transfer. Of course, there are other ways to connect Edison like Multi-Factor Authentication(MFA), and X windows. NERSC recommends transferring data to and from NERSC using globus online, scp/sftp for smaller files(<1 GB), bbcp or gridftp for large files

#### **Running Job**

Interactive Job: 
```
salloc -N 2 -q debug -L SCRATCH -t 00:30:00
# The -N flag specifices the number of nodes, -q specifices the name of the QOS, specify license need for the file systems your job needs.

srun -n 48 -c 4 ./program
# The -n flag specifices the total number of MPI tasks, -c specifices the number of openmp threads, -N specifices the number of MPI tasks per Edison node.
```

Batch Job:
```
#!/bin/bash -l 
#SBATCH -q debug
#SBATCH -N 2
#SBATCH -t 00:10:00
#SBATCH -L SCRATCH 
srun -n 48 ./my_executable
```

Error message: OOM(out of memory) killer terminated this process, it means that code has exhausted the memory available on the node. Solution: use more nodes and fewer cores per node.

#### **Module Command**

* **module list**: list all the modulefiles that currently loaded
* **module avail**: list all the modulefiles that are available to be loaded
* **module load**: add one or more modulefiles to your current environment
* **module display**: to see exactly what a given modulefile will do to your environment
* **module show**: show how your environment gets modified and also some other information
* **module snapshot -f filename**: captures the currently loaded modules and saves the list into a file for later restore.

The shifter is an open-source software stack that enables users to run a custom environment on an HPC system, it is compatible with the popular Docker container format so that users can easily run the Docker container on NERSC systems.

NERSC system supports many kinds of compilers, and performance and debugging tools like gdb, and Valgrind. It also has tools for data analytics including statistics, machine learning, imaging, etc.


### **TianHe**

#### **Prototype**

Work partition: MT-2000+, the main frequency is 2.0GHz, one node has 32 cores, and the memory of a single node is 16GB. In fact, the test uses 64 cores;

Test partition: FT-2000+, the main frequency is 2.3GHz, one node is 64 cores, and the single node memory is 64GB;

Compared with TianHe-1: X5670, the main frequency is 2.93GHz, one node is 12 cores, and the single node memory is 24GB;

#### **Usage**

The commands to load the library, view the library, and view the installation path of the library are the same as those of Edison;

```
yhi # Check the available nodes;
yhqueue -u wzhang # Check the submitted tasks;
yhrun -N 3 -n 32 -p work -w cn[63-48] ./gtc # -N number of node,-p execution partition,-w designate node;
yhcancel
yhbatch -N 32 -n 32 -c 32 -p test ./jobscript;
yhbatch -N 32 -n 32 -c 1 -x[41,51] -p test ./jobscript  #-x designate prohibited nodes;
```
