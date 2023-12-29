---
layout: post
title: "Python Notes"
categories: System
tags: Python
--- 

* content
{:toc}

Python has many useful packages. In this post, I make some notes about some python modules such as subprocess, paramiko, zipfile, format. 




### **Timeit**

timeit is to measure the execution time.
```
timeit.timeit(stmt='pass', setup='pass', timer=<default timer>, number=1000000)
# Create a Timer instance, and the parameters are: stmt（the function or code segment to be tested), setup (Initilizing code)，timer (timer function)，number (number of execution);

timeit.repeat(stmt='pass', setup='pass', timer=<default timer>, repeat=3, number=1000000)
# Create a Timer instance, specify the number of repetitions of the entire test, and return a list containing the execution time of each test. Using this function can easily implement the method of averaging multiple tests;

# Example:

def add2(x, c):
    return [xx+c for xx in x]

x = np.random.random(10**5).astype(np.float32).tolist()
t0=timeit.timeit("add2(x,1)", setup="from __main__ import add2, x", number=1000)
print("cost {} seconds ".format(t0))
```

### **Numba**

Numba translates Python functions to optimized machine code at runtime using the industry-standard LLVM compiler library.　JIT, Just-in-time compilation.

Numba likes loops, numpy functions numpy broadcasting．However, Pandas library is not understood by Numba and as a result Numba would simply run this code via the interpreter but with the added cost of the Numba internal overheads.
```
@jit(nopython=True) # Set "nopython" mode for best performance
```
Be careful not to blindly believe in JIT, not everything can be accelerated by JIT. For example, a statement like [[[i,j,0] for j in range(y)] for i in range(x)] is compiled by JIT. It will be slow. Of course, the average test time also includes the time of jit compilation statement, which is relatively time-consuming.

Numpy's Ufunc (universal function) function can act on each element of the narray object, rather than operating on the narray object. For example, add(), subtract(), multiple(), divide(), etc. We can use Numba's vectorize to implement Numpy's Ufunc function, thereby speeding up the operation of the code. The parameters accepted by the function under vectorize are all numbers instead of the entire array, and when we use it, the entire array is passed in. The coolest thing of vectorize is that it can be "parallel". Use @jit(nogil=True) to achieve efficient concurrency. Generally speaking, the larger the amount of data, the more obvious the effect of concurrency. Conversely, when the amount of data is small, concurrency is likely to reduce performance

```
The following Python language features are not supported in Version 0.41:
1. Class definition
2. Exception handling (try .. except, try .. finally)
3. Context management (the with statement)
4. Some comprehensions (list comprehension is supported, but not dict, set or generator comprehensions)
5. Generator delegation (yield from)
```
Reference [numpysupported](https://numba.pydata.org/numba-doc/dev/reference/numpysupported.html),[pysupported](http://numba.pydata.org/numba-doc/dev/reference/pysupported.html), [performance-tips](https://numba.pydata.org/numba-doc/dev/user/performance-tips.html)

### **H5py**

H5py files are containers for storing two types of objects: datasets and groups. datasets are data collections similar to arrays, and groups are containers like folders. They are like python dictionaries with keys and values. Groups can store datasets or other group.

### **Subprocess**

One process can fork a subprocess, making the subprocess executes another program, the *subprocess* module in python can achieve that.

subprocess.call([“ls”, “ -l”])

This function is encapsulated based on subprocess.Popen():
```
class Popen(args, bufsize=0, executable=None, stdin=None, stdout=None, stderr=None, preexec_fn=None, close_fds=False, shell=False, cwd=None, env=None, universal_newlines=False, startupinfo=None, creationflags=0)

subprocess.check_call() # The parent process waits for the child process to complete, returns 0, checks the exit message
subprocess.check_output() # The parent process waits for the child process to complete, returns the output result of the child process to standard output, and checks the exit information

child = subprocess.Popen('ping -c4 blog.linuxeye.com',shell=True)
print(child.stdout.read())
child.wait()
child.kill()

child1=subprocess.Popen(["cat", "/etc/passwd"], stdout=subprocess.PIPE)
child2=subprocess.Popen(["grep", "0:0"], stdin=child1.stdout, stdout=subprocess.PIPE)
out.child2.communicate()
```
subprocess.PIPE actually provides a buffer for the text until the communicate() method reads the text from the PIPE. communicate() is a method of the Popen object that blocks the parent process until the child process completes.

### **Joblib**

Save model:
```
from sklearn.externals import joblib
joblib.dump(value, filename, compress=0, protocol=None, cache_size=None)
```
Persist any python object as a file. And return a list of strings, indicating where these data are stored respectively.

### **Copy**

Shared reference: the enhanced assignment statement (b+=1) is more advanced than the ordinary assignment statement (b=b+1), because the enhanced assignment has more "write-back" functions than ordinary ones, and will be appended when the conditions are met. However, ordinary assignment will create a new object. Shared reference leads to the fact that there is always only one variable object in the enhanced assignment statement, and the Python parser will not create a new memory object when parsing the statement.

Pay attention to shallow copy and deep copy in Python:
```
from copy import deepcopy
=, copy, deepcopy
```

### **Paramiko**

The paramiko module, based on SSH, is used to connect to remote servers and perform related operations. It can be connected based on username and password, based on public key and private key characters．
```
import paramiko
ssh=paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(hostname='172.11.2.109', port=22, username='root', password='founder123')
stdin, stdout, stderr = ssh.exec_command('ls')
result = stdout.read()
```

### **Zipfile**

gz: usually compress one file. It can becombined with tar, so we can package files first and then compress the folder. Tar only packs and does not compress. zip has lower compression rate than tar

```
import zipfile, os  
z = zipfile.ZipFile(filename, 'w') 
if os.path.isdir(testdir):  
     for d in os.listdir(testdir):  
         z.write(testdir+os.sep+d) 
         z.close()

z = zipfile.ZipFile(filename, 'r')  
for i in z.infolist():  
    print (i.file_size, i.header_offset, i.filename)
```
### **Format**

```
print("{name} and {action}".format(name="zhang", action="play"))

print("{0} and {1}".format("zhang", "play"))
```
Python string formatting: 
```
{<parameter number>:<format control tag>}
{:0>5} 0 means padding, 5 means width, > means right alignment, ^ means center, < means left alignment
```

Hexadecimal conversion:

* b, o, d, x respectively represent two, eight, ten, hexadecimal,
* s : Get the return value of the __str__ method of the incoming object and format it to the specified position,
* r : Get the return value of the __repr__ method of the incoming object and format it to the specified position

```
print('{:o}'.format(250))
print('Request: {0!r}'.format(self.request))
```

### **Shutil**

The shutil module offers a number of high-level operations on files and collections of files. In particular, functions are provided which support file copying and removal.

```
shutil.move
shutil.copytree
shutil.rmtree
shutil.copy #copy data and mode bits
```

### **Warning**
```
warnings.filterwarning("ignore")
python -W ignore file.py
```

### **Others**

The zip function packs the elements in the object into tuples, and returns the object composed of these tuples, which can be converted into a list. Arrays are represented by data structures such as list and tuple. List is a dynamic pointer array, which stores A pointer to an object whose elements can be elements of any type;

```
re.match(pattern, string, flag=0) # The flag has re.I to ignore case; re.X to increase readability, ignore spaces and comments; In regular expressions, ^ indicates the beginning of the line, and $ indicates the end of the line;

os.system(cmd) # execute the Linux command
os.getcwd() # get current work directory
os.path.abspath(‘.’)　# file path
```
```
class student (people):
    def __init__(self, attribute1, attribute2):
        super(student, self).__init__()
    

```
It initializes the properties inherited from the parent class, and uses the initialization method of the parent class to initialize the inherited properties. Of course, if the logic of initialization is different from that of the parent class, it is also possible to reinitialize by yourself without using the method of the parent class. Check [here](https://realpython.com/python-super/).