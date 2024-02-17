---
layout: post
title: "High Performance Computing (2)"
categories: HPC
tags: openAcc CUDA
--- 

* content
{:toc}

To achieve high performance computing, CUDA and openAcc are really useful to accelerate the speed of a program. In this post, I mainly make some notes about openAcc and CUDA.




### **openACC**

* pgaccelinfo	to check if Nvidia GPU and CUDA drive are installed properly;

* For basic use of openACC, you can refer to [gpuworld](http://bbs.gpuworld.cn/thread-347-1-1.html);

* pgcc -acc -ta=tesla:cc70 -Minfo=all a1.c  //the -⁠acc flag to enable OpenACC directives, the -ta=tesla flag to target NVIDIA GPUs and the -Minfo flag to display information while compiling;

* export PGI_ACC_TIME=1   output the execution time statistics after the program is executed;

* For basic data copy operations, copy/copyin/copyout, copyin is copied to the GPU, copyout is copied back to the CPU, copy is copyin at the beginning of the statement block, and copyout at the end.

* For simple data, openAcc can handle it automatically. For arrays or references, you need to manually assign the start address and copy length of the data copy; for example, int& mgrid (actually an integer, but it is referenced), for a pointer, it is enough to tell the GPU to copy one, so use mgrid[0:1].

* If you want to perform cout debugging output in the block, you need to update the host data.

* For custom types such as Array, the Copy operation performs a shallow copy. When using other methods to put it in the GPU memory in advance, you need to declare present.

* The atomic update is equivalent to locking, and recording before modification;

### **CUDA**

CUDA is a parallel computing platform and programming model, supported by NVIDIA's GPU, the following is a CUDA code example:

```
__global__
void parallel_pi(long samples, long *in, trng::yarn5s r) {
	long rank=threadIdx.x;
	long size=blockDim.x;
	r.jump(2*(rank*samples/size));// jump ahead
	
	trng::uniform01_dist<float> u;// random number distribution
	in[rank]=0; // local number of points in c i r c l e

	for (long i=rank*samples/size; i<(rank+1)*samples/size; ++i) {
		float x=u(r), y=u(r);
		// choose random x − and y − coordinates
                // std::cout<<x<<" ";
		if (x*x+y*y<=1)
		// i s point in c i r c l e ?
		++in[rank];
		// increase thread − local counter
	}
}

int main(int argc, char *argv[]) {
const long samples=1000000l; // total number of points in square
const int size=128; // number of threads
long *in_device;
cudaMalloc(&in_device, size* sizeof(*in_device));
trng::yarn5s r;

// s t a r t parallel Monte Carlo
parallel_pi<<<1, size>>>(samples, in_device, r);
// gather results
long *in=new long[size];
cudaMemcpy(in, in_device, size* sizeof(*in), cudaMemcpyDeviceToHost);
long sum=0;
for (int rank=0; rank<size; ++rank)
	sum+=in[rank];
// print result
std::cout << " pi = " << 4.0*sum/samples << std::endl;
return EXIT_SUCCESS;
}
```
A GPU has thousands of cores, and each core can run more than 10 threads. All the threads together are called a grid, and the grid is divided into (thread) blocks. A thread block contains several threads. Cuda c introduces a new data type dim3, which is equivalent to a Struct that contains unsigned int x, y, z; the grid size is represented by the built-in variable gridDim, gridDim.x, gridDim.y, and gridDim.z represent the number of thread blocks in the x, y, z directions. The number of each thread block in the grid is represented by the built-in variable blockIdx, blockIdx.x, blockId.y, blockId.z; the size of the thread block is represented by the built-in variable blockDim, blockDim.x indicates the number of threads owned by the current thread block in the x directions. The thread number in any thread block is represented by the built-in variable threadIdx; the block is used to specify the shape of each thread block, and the grid is used to formulate the thread network grid shape.

Call process: data initialization, open up memory, copy data to device memory, use a pair of three pointed numbers <<<The first parameter specifies the shape of the thread grid, and the second parameter specifies the shape of the thread block >>> call A function executed on the device, and then the device executes the parallel code in the kernel; after the execution of the kernel code is completed, the control right is returned to the host, and the host retrieves the parallel computing result of the kernel from the device.

Compiling the cuda code, this section of the compilation instruction is quite special, because the TRNG random number library is used, so the address of the library is specified:

```
nvcc -o rancuda rancuda.cu -lcuda -lcudart -L/usr/local/lib -ltrng4 -Xcompiler \"-Wl,-rpath,/usr/local/lib\"
```

One of the extensions of the CUDA C language to the C language is to add some function prefixes:

* __host__ int foo(int a){} is the same as foo(int a){} in C or C++, it is a function called by the CPU and executed by the CPU; the *host* prefix is for ordinary function, which can be ignored by default;

* __global__ void foo(int a){} represents a kernel function, which is a group of parallel computing tasks executed by the GPU, and is called in the form of foo<<>>(a) or driver API; the *global* prefix represents the the function needs to be called on the host and executed on the device; common functions in the CPU cannot be run;

* __device__ int foo(int a){} indicates a function called by a thread in the GPU, and the function defined by the device prefix can only be executed on the GPU, so the common functions cannot be called in the function modified by *device*;

If the error is reported as follows, it is not allowed in the CUDA file .cu file because an ordinary function is mistakenly added to the *global* prefix definition function.
```
error : calling a __host__ function from a __global__ function is not allowed.
```

CUDA cudaMalloc() function prototype:
```
cudaError_t cudaMalloc (void **devPtr, size_t  size );
```
Example:
```
float *device_data=NULL;
size_t size=1024*sizeof(float);
cudaMalloc((void**)&device_data,size);
```
The reason why the address of *device_data* is taken is to assign the first *address of the cudaMalloc array* on the GPU memory to *device_data*; the first parameter passes the address of the pointer variable stored in the cpu memory. After cudaMalloc is executed, write to this address an address value. We use (void\*\*) in front because some compilers do not support implicit type conversion.