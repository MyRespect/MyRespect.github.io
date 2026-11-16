---
layout: post
title: "High Performance Computing (6)"
categories: HPC
tags: AutoCAD DXF Grid
--- 

* content
{:toc}

AutoCAD is a commercial computer-aided design (CAD) and drafting software application. AutoCAD is planned to be used in our project, so I decided to investigate the secondary development of AutoCAD files.




### **File Format**

Autocad中比较通用的文件格式有Drawing Interchange Format(DXF)或drawing(DWG)，我们可以构建一个转换器将这些文件格式转换为更加开发的ESRI shapefile 或keyhole markup language (KML) 格式, [参考链接](https://www.ibm.com/developerworks/cn/opensource/os-autocad/index.html) 。

1. DWG在 AutoCAD 中保存文件时的默认格式，可以使用开源库LibreDWG来读取这些文件．低版本的软件不能打开高版本dwg文件;

2. DXF 格式是 AutoCAD 中的一个导出选项,可以使用开源 dxflib 库读取这些文件. DXF是autodesk公司开发的用于autoCAD与其他软件之间进行CAD数据交换的CAD数据文件格式,是一种基于矢量的ASCII文本格式，由于autocad现在是最流行的cad系统，dxf成为事实上的标准; dxf文件中层表中说明每一层的颜色，线形，在块段中说明块所在的层，属性以及其在图形中的位置，在实体段中说明直线的起点，终点，以及元的圆心半径等集合信息和各实体所在的层．例如　flag 8 表示层的组码

3. Google Earth 和 Google Maps 使用的 KML 格式是 XML 的一种专门形式；因此，可以使用诸如 Xerces-C++ XML Parser这样的库来处理 KML 文件;

4. shapefile 格式是由 ESRI发布的一个商业（但是开放）二进制数据格式。您可以使用开源 OGR Simple Feature Library 来轻松访问这些文件;

### **Polyline**

autoCAD中的线条信息, polyline 多义线是AutoCAD中的特殊图形实体，它由一系列首尾相连的直线和圆弧组成，在图形数据库中以顶点(即相连点)子实体的形式保存信息，与位置、形状有关的信息主要有两个：一是顶点坐标数值，保存在10组码中；二是顶点凸度(Bulge)，保存在42组码中。 AutoCAD中约定：凸度为0是直线顶点，它与下一个顶点连接为一直线；凸度不为0是圆弧顶点，它与下一个顶点连接为一圆弧；凸度值为负表示顺时针圆弧，凸度值为正表示逆时针圆弧；凸度绝对值小于1表示圆弧包角小于180°，凸度绝对值大于1表示圆弧包角大于180°。凸度与圆弧包角的关系是：圆弧包角=4×arctan(abs(凸度值))

### **Grid**

1. 创建网格图元: 创建标准形状，例如长方体、圆锥体、圆柱体、棱锥体、球体、楔体和圆环体 (MESH);

2. 从其他对象创建网格: 创建直纹网格对象、平移网格对象、旋转网格对象或边界定义的网格对象，这些对象的边界内插在其他对象或点中;

3. 从其他对象类型进行转换将现有实体或曲面模型（包括复合模型）转换为网格对象 (MESHSMOOTH);

4. 创建自定义网格: 使用 3DMESH 命令可创建多边形网格，通常通过 AutoLISP 程序编写脚本，以创建开口网格。使用 PFACE 命令可创建具有多个顶点的网格，这些顶点是由指定的坐标定义的。尽管可以继续创建传统多边形网格和多面网格，但是建议用户将其转换为增强的网格对象类型，以保留增强的编辑功能.


### **FreeCAD**

FreeCAD is an open-source parametric 3D modeler made primarily to design real-life objects of any size. FreeCAD has a built-in Python interpreter. If you don't see the window labeled 'Python console' as shown below, you can activate it under the View -> Panels -> Python console to bring-up the interpreter.

```
freecadcmd testfreecad.py
```