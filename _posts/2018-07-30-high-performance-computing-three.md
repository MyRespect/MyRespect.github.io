---
layout: post
title: "High Performance Computing (3)"
categories: HPC
tags: MPI
--- 

* content
{:toc}

Message Passing Interface (MPI) is a standardized and portable message-passing standard designed by a group of researchers from academia and industry to function on a wide variety of parallel computing architectures. The standard defines the syntax and semantics of a core of library routines useful to a wide range of users writing portable message-passing programs in C, C++, and Fortran. 




MPI中的进程序列rank，各进程通过函数MPI_Comm_Rank()获取各自的序号，消息号是消息的标号，通讯器是一类进程的集合，在集合内进程间可以相互通信，消息包含数据和信封(接受和发送进程的序号，消息号，通信器)。

### **MPI**

获取当前时间:

(1) double MPI_Wtime(void)  获取当前时间, 在插入MPI提供的头文件后, 可以获得时间函数，计时的精度由 double MPI_Wtick(void) 取得;

(2) clock_t clock(void) 取得当前时间, 一般在C/C++中插入time.h获得时间函数， 计时的精度由常数 CLOCKS_PER_SEC 定义。

点到点通信函数:

(1) 使用MPI_Barrier(communicator)来完成同步

(2) 使用MPI_Send(message, size, data_type, dest_id, tag, communicator) 来把数据message封装起来成为真正的消息结构，向进程号为dest_id的进程发送数据，是否要先把消息存入缓冲区根据默认缓冲区的大小确定。

(3) 使用MPI_Recv(message, size, data_type, src_id, tag, communicator, status)来接收数据，把已经到达接收缓冲区的数据解析到message数组中，只有全部数据都解析出来时，函数才返回

(4) 使用MPI_Bsend(message_data, size, data_type, dest_id, tag, communicator) 来发送数据，需要预先注册一个缓冲区，并调用MPI_Buffer_attach(buffer, buf_size)来供MPI环境使用.

(5) 使用MPI_Buffer_attach(buffer, size)来把缓冲区buffer提交给MPI环境，其中buffer是通过malloc分配的内存块。

(6) 使用MPI_Buffer_detach(&buffer,&size)来确保传输的完成，尽量把detach和attach函数配对使用，正如尽可能同时使用malloc和free，同时使用Init和Finalize，防止遗漏！

(7) 使用MPI_Pack_size(size, data_type, communicator, &pack_size)来获取包装特定类型的数据所需要的缓冲区大小(还没有计入头部，所以真正缓冲区大小 buf_size = MPI_BSEND_OVERHEAD + pack_size，如果有多份数据发送，则buf_size还要叠加)。

(8) 就绪通信MPI_Rsend()和同步通信MPI_Ssend()，参数都是一致的，函数的区别在于，如果已经保证接收动作在发送动作之前启动了(可以利用MPI_Barrier函数做到这一点)，那么就可以使用MPI_Rsend()提高效率；如果需要保证接收动作发生后，发送动作才能返回，那么就使用MPI_Ssend()

(9) MPI_Reduce(void* send_data, void* recv_data, int count,...), 在每个进程上都有一个输入元素，将一个输出元素数组返回给根进程

(10) MPI_Allreduce()将规约的结果分发到所有进程

(11) MPI_SendRecv(void* sendbuf, int sendcount, MPI_Datatype datatype, int dest, int senttag, void* recvbuf, int recvcount, MPI_Datatype, datatype) 

集合通信:

(1) MPI_Bcast广播，使得数据有p份拷贝

(2) MPI_Scatter散发，每份数据只拷贝一次

(3) MPI_Gather收集，每份数据只拷贝一次

(4) MPI_Reduce归约

初始化与结束:

(1) 使用MPI_Init(&argc, &argv)来初始化MPI环境，可能是一些全局变量的初始化。

(2) 使用MPI_Comm_rank(communicator, &myid)来获取当前进程在通信器中具有的进程号。

(3) 使用MPI_Comm_size(communicator, &numprocs)来获取通信器中包含的进程数目。

(4) 使用MPI_Finalize()来结束并行编程环境。之后我们就可以创建新的MPI编程环境了。

数据类型和预定义的量:

(1) 用于作为参数的数据类型 MPI_INT, MPI_DOUBLE, MPI_CHAR, MPI_Status 

(2) 预定义的量 MPI_STATURS_IGNORE, MPI_ANY_SOURCE, MPI_ANY_TAG


### **Compile**
```
mpicc -g(加入调试信息)
mpirun -np N(同时运行的进程数) -v(尽可能显示详细信息) -stdin filename(作为标准输入)
which mpicc #which 在ubuntu中查找系统中指定的可执行文件
```

### **openMP**

在多线程中不能使用clock计时，clock是所有cpu滴答数总和，进程越多占用cpu越多时间越长，换成omp_get_wtime();
CSDN一篇博文[openMP简介](https://blog.csdn.net/magicbean2/article/details/75530667).下面简单介绍几个函数:

* omp_set_nested(): 用于设置是否允许openMP进行嵌套并行，嵌套并行就是在并行区域内嵌套另外一个并行区域;
* omp_get_num_procs(): 返回空闲的处理器个数;
* omp_get_max_threads(): 返回最大的线程数;
* omp_get_thread_num(): 返回当前进程标号, 0表示主进程;