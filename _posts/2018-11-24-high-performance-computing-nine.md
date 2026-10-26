---
layout: post
title: "High Performance Computing (9)"
categories: HPC
tags: Debug
--- 

* content
{:toc}

In this post, I make notes about some methods for debugging and optimizing the program.




### **Tricky**

1. Locate the code position according to the error instruction:
```
   addr2line -Cif -e gtc_double_no_output 0x5438c4b
```

2. Periodically execute and check the result of a command:
```
	watch -n 10 nvidia-smi
```

3. double free or corruption (out), double free or corruption (!prev): the general reason is that the pointer address is released twice, or the array is out of bounds.

4. The method of locating the bug:

* Dichotomy + Return to determine the wrong line;

* The wrong line does not necessarily equal the cause of the error;

* Simply assign values to the variables used, and observe whether the error still exists, so as to determine those variables that have problems;

* Reverse backtracking, looking forward for the assignment statement of the variable;

### **Gprof**

Linux 下C++性能测试工具gprof, 编译的时候打开编译开关, -pg.
```
g++  -pg test_gprof.cpp test_gprof_new.cpp -o test_gprof
```
执行后会新生成一个gmon.out文件, 运行性能测试工具
```
gprof test_pgrof gmon.out
```
可以看到各种参数跃然于屏上:
(1) flat profile，包括每个函数的调用次数，以及每个函数消耗的处理器时间;
(2) call graph 包括函数的调用关系，每个函数调用花费的时间;

### **Valgrind**

(1) Memcheck是一个内存检查器，发现开发中绝大多数内存错误的使用情况，比如使用未初始化的内存，使用已经释放的内存，内存访问越界等；

(2) Callgrind它用来检查程序中函数调用过程中出现的问题；

(3) Cachegrind用来检查程序中缓存出现的问题，它模拟CPU中的一级缓存l1,D1和L2二级缓存，能够精确的指出程序中cache的丢失和命中，能够提供cache丢失次数，内存引用次数，以及每行代码，函数产生的指令数, Cache对目前系统的性能有很大的影响，因此这些信息可以指导调整代码，提高程序性能；

(4) Helgrind用来检查多线程程序中出现的竞争问题， 检测多线程竞争资源的工具；

(5) Massif检查程序中堆栈使用出现的问题；它能测量程序在堆栈中使用了多少内存，告诉我们堆栈，堆管理块和栈的大小，对内存使用进行优化。

最常用的调用格式：
Valgrind [options] prog-and-args
-tool=toolname最常用的选项，运行valgrind中名为toolname的工具，默认为memcheck;
```
g++ -g -o testValgrind testValgrind.cc
~/bin/bin/valgrind --tool=memcheck --leak-check=full ./testValgrind
```
gcc的-g选项：创建符号表，符号表包含了程序中使用的变量名称的列表；会保留代码的文字信息，便于调试。

### **CUDA Visual Profiler**

一个图形化的剖析工具，可以显示你的应用程序中CPU和GPU的活动情况，利用分析引擎帮助你寻找优化的机会。
Visual Profiler下面的框中 Analysis是对程序改进的一些意见; details中显示的是程序运行的详细数据，包括函数开始时间，持续时间，线程，块以及带宽等数据；
Console中显示是控制台显示的信息，包括一些程序中的printf 和运行时的警告.

CPU和GPU部分显示了硬件和执行内容信息，点某一项则将时间条对应的部分高亮，便于观察，同时右边详细信息会显示运行时间信息。从时间条上看出，cudaMalloc占用了很大一部分时间. 从时间条上看出，cudaMalloc占用了很大一部分时间。下面分析器给出了一些性能提升的关键点，包括：低计算利用率（计算时间只占总时间的1.8%，也难怪，加法计算复杂度本来就很低呀！）；低内存拷贝/计算交叠率（一点都没有交叠，完全是拷贝——计算——拷贝）；低存储拷贝尺寸（输入数据量太小了，相当于你淘宝买了个日记本，运费比实物价格还高！）；低存储拷贝吞吐率（只有1.55GB/s）。这些对我们进一步优化程序是非常有帮助的。

我们点一下Details，就在Analysis窗口旁边。通过这个窗口可以看到每个核函数执行时间，以及线程格、线程块尺寸，占用寄存器个数，静态共享内存、动态共享内存大小等参数，以及内存拷贝函数的执行情况。这个提供了比前面cudaEvent函数测时间更精确的方式，直接看到每一步的执行时间，精确到ns。

常见的问题:

(1) 该程序计算和复制数据的比例较低，即计算量相对于复制数据量差别不大，复制时间太长，显示不出GPU并行计算的效率，大量时间花费到了复制上;

(2) 该程序复制数据和计算的重叠度较低，即复制数据的同时没有进行任何计算，浪费了GPU带宽，本文使用的是矢量相加代码，将数据在cpu生成复制到gpu计算再复制回来，自然不会有任何重复;

(3) 该程序内核并发度较低，即两个核函数并行执行的百分比较低，最好使用更多的核函数在不同的grid执行;

(4) 较低的内存通道，内存复制没有使用全部的主机到设备的带宽，仅达到1.542GB/s，现在GPU一般能达到几十GB/s，少量内存复制没有发挥出GPU主机到设备的带宽优势, 这是最基础也是最有效地优化方式.