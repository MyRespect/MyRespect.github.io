---
layout: post
title:  "High Performance Computing (4)"
categories: HPC
tags: openFoam
--- 

* content
{:toc}

Scientific computing is an important application in HPC. In this blog, I will introduce OpenFOAM, which is an open-source software for computational fluid dynamics (CFD)




### **Install OpenFoam**

OpenFOAM 的下载和安装链接: [OpenFOAM](https://openfoam.org/download/6-ubuntu/)

我的主机装了PGI编译器，为了尝试安装OpenFOAM, 把mpicc 由 mpich 换成了openMPI, 根据官方教程运行如下命令：
```
sudo update-alternatives --set mpi /usr/lib/openmpi/include
```
但是安装运行仍然报错, pgcc-Error-Unknown switch: --showme:link，应该是pgcc编译器不兼容的问题, 这种直接下载安装的方式在我的主机上不合适．
然后又尝试修改openfoam编译配置文件：
将 /opt/openfoam6/etc/config.sh/mpi 里面的文件中:
libDir=`mpicc --showme:link | sed -e 's/.*-L\([^ ]*\).*/\1/'`
替换为
libDir=`mpicc -link-info | sed -e 's/.*-L\([^ ]*\).*/\1/'`

来源[这里](https://www.cfd-online.com/Forums/openfoam-installation/97581-showme-errors.html): I've found out that "--showme:compile" and "--showme:link" are Open-MPI options only. To change that to work with MPICH2, I've had to edit "/opt/openfoam211/etc/config/settings.sh" file and exchange "mpicc --showme:compile" and "mpicc --showme:link" for "mpicc -compile-info" and "mpicc -link-info".

但是执行 simpleFoam -help 报错如下：
```
simpleFoam: symbol lookup error: /opt/openfoam6/platforms/linux64GccDPInt32Opt/lib/openmpi-system/libPstream.so: undefined symbol: ompi_mpi_op_sum
```
至此，不再主机上折腾了，在虚拟机上按照官方教程顺利安装成功．OpenFOAM使用的OpenMPI和我们使用的pgi版本的MPI不一致。

### **Usage**

参考[东岳流体](http://www.dyfluid.com/), OpenFoam处理的流程:

(1) 前处理, 准备算例数据; 用户进行参数设置;

(2) 运行, 执行命令;

(3) 后处理, 主要是画图, 调整滤镜亮度等;

程序在 OpenFOAM 中分为两个类型:

(1) solvers(程序): 依据计算流体力学模型创造的求解器,每个都用来求解一个特定的问题;

(2) utilities(工具): 执行简单的前后处理任务,主要负责数据操作和代数几何运算;

OpenFOAM 内部包含了许多编译好了的库,在编译程序和工具时候它们动态地被连接在一起。其中的物理模型库以源代码的方式提供,所以用户可以添加自己的模型在各种库中。

我们想解决的连续介质问题无法使用计算机可识别的概念(例如 bits,bytes,integers) 来表示。因此,连续介质问题首先需要使用文字语言来呈现,然后以时间和空间的三个维度的偏微分方程来表示。偏微分方程会包含如下信息:标量、矢量、张量、张量运算、量纲分析等。这些方程的求解涉及到离散、矩阵运算、求解器以及求解算法。

在编程中使用对象来表示物理对象和抽象实体带来的便捷性不容低估。创建这种可以使用代码中所有结构的类分层使得代码管理更容易。新的类可以从其它的类上**继承**。例如vectorField 可以从 vector 类以及 Field 类上继承过来。C++也提供了**模板**类机制, 例如Field<Type>可以表示任何的<Type>场,例如 scalar,vector,tensor 等。模板类的特性保留在任何从模板类创造的类型上。模板和继承大大简化了重复代码并且使得整体的代码结构更加清晰。 

OpenFOAM 代码设计的中心主题就是使用 OpenFOAM 的类来编写求解器,这些类应该能够很好的表示某个特定的待求解的偏微分方程。如果想让 OpenFOAM 使用自己的类表示这个偏微分方程,并且满足一些其它的一些要求, 这就需要 OpenFOAM 语言具有面向对象的特性,例如继承、模板类、虚函数以及操作符重载。

OpenFOAM 使用的并行计算方法为计算域分解法。在这个方法中,几何和附属场被拆分为单独的块,每个块用单独的 cpu 来进行计算。并行计算主要涉及到网格和场的分解、并行运行程序、分解场的后处理。OpenFOAM 使用的并行计算方法为计算域分解法。在这个方法中,几何和附属场被拆分为单独的块,每个块用单独的 cpu 来进行计算。并行计算主要涉及到网格和场的分解、并行运行程序、分解场的后处理。

自动生成简单六面体网格的程序 blockMesh, blockMesh 程序用来创建均匀或者非均匀分布以及曲边的网格. snappyHexMesh 程序,它用来依据几何文件全自动切分六面体网格并生成复杂的多面体网格。

OpenFOAM 提供了 paraFoam (依托 ParaView) 来进行后处理。 OpenFOAM 提供的后处理软件是建立在 ParaView 之上的插件。插件编译成为两个库: PVFoamReader 和 vtkPVFoam,它们基于 ParaView-5.4.0。paraFoam 由 OpenFOAM 提供的用来运行 ParaView 的插件。像任何其它的 OpenFOAM 程序一样,要么通过在算例文件夹的终端下执行单一命令,要么就使用-case 命令来对某个算例执行操作:
```
run  //进入用户的执行文件夹
cp -r $FOAM_TUTORIALS/incompressible/simpleFoam/pitzDaily .  //拷贝算例
cd pitzDaily 
blockMesh  //运行 blockMesh 生成网格
simpleFoam //进行 simpleFoam 运行
```
OpenFOAM 使用 C++模板预定义了大量的热物理模型库。热物理模型从第一层开始, 这一层定义了基本的状态方程。然后在这一层的基础上添加附加模型。 OpenFOAM 包含了很多针对具体问题的求解器, 每个求解器所用的方程和算法都不相同。因此用户需要在最初的时候针对不同的例子, 对使用哪些模型进行决定。求解器代码决定了算例需要定义的物理参数,其中有一些模型的参数用户可以在运行之后,通过constant 字典中的字典文件进行更改。

### **Doxygen**

Doxygen是一种开源跨平台的，以类似JavaDoc风格描述的文档系统，完全支持C、C++、Java、Objective-C和IDL语言，部分支持PHP、C#。注释的语法与Qt-Doc、KDoc和JavaDoc兼容。Doxygen可以从一套归档源文件开始，生成HTML格式的在线类浏览器，或离线的LATEX、RTF参考手册。

Doxygen 是一个程序的文件产生工具，可将程序中的特定批注转换成为说明文件。对于未归档的源文件，也可以通过配置Doxygen来提取代码结构。或者借助自动生成的包含依赖图（includedependency graphs）、继承图（inheritance diagram）以及协作图（collaborationdiagram）来可视化文档之间的关系。