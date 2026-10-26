---
layout: post
title: "High Performance Computing (5)"
categories: HPC
tags: netCDF
--- 

* content
{:toc}

NetCDF is a set of software libraries and self-describing, machine-independent data formats that support the creation, access, and sharing of array-oriented scientific data.




### **Installation**

Download netCDF from [netCDF](https://www.unidata.ucar.edu/downloads/netcdf/index.jsp). 

Here I install netCDF from the source code, but note that Ubuntu has a netCDF package.

If we want to use HDF5, then we have to install HDF5 first, and you can check [CSDN](https://blog.csdn.net/toby54king/article/details/78980365)．To install the C++ version of the program, you need to install it based on the C version, and the process is the same as installing the c version. The difference between the C version and the C++ version lies in the included header file #include <netcdfcpp.h>, in which the related interface C++ version is further encapsulated.
```
~/netcdf-4.6.1$ ./configure --prefix=/usr/local/netcdf --disable-dap --disable-netcdf-4
Make check install
Make
Sudo Make install
```

### **Usage**

NetCDF file content: *variable* corresponds to real physical data, *dimension* and *attribute* corresponds to the specific physical meaning of variable dimension and value. A good reference can be found from [netCDF_UCLA](https://www.hoffman2.idre.ucla.edu/netcdf).
```
#include <iostream>
#include <string>
#include <netcdfcpp.h>
using namespace std;

static const int NC_ERR = 2;
int main(void)
{
   string dataTemp="something to say";
   char* dataOut=(char*)dataTemp.c_str();
   int NX=dataTemp.length();
   int NY=1;
   
   NcFile dataFile("mysimple_xy.nc", NcFile::Replace);
   if (!dataFile.is_valid())
   {
      cout << "Couldn't open file!\n";
      return NC_ERR;
   }
   NcDim* xDim = dataFile.add_dim("x", NX);
   NcDim* yDim = dataFile.add_dim("y", NY);
   NcVar *data = dataFile.add_var("data", ncChar, xDim, yDim);
   data->put(dataOut, NX, NY);
   cout << "*** SUCCESS writing example file simple_xy.nc!" << endl;
   return 0;
}
```

Compile and Run
```
// CC -o pgm pgm.cpp -I$NETCDF_HOME/include -L$NETCDF_HOME/lib -lnetcdf_c++ -lnetcdf -lm 
g++ -o simple_wr simple_xy_wr.cpp -I/usr/local/netcdf/include  -L/usr/local/netcdf/lib -lm -lnetcdf
```
Might prompt: /usr/bin/ld: cannot find -lnetcdf, then you need to build a soft link:
```
sudo ln -s /usr/local/netcdf/lib/libnetcdf.so /usr/lib/libnetcdf.so
```
