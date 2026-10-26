---
layout: post
title:  "High Performance Computing (7)"
categories: HPC
tags: MathLink
--- 

* content
{:toc}

MathLink is a library of functions that implement a protocol for sending and receiving Mathematica expressions. Its uses fall into two general categories, one is to allow external functions written in other languages to be called from within the Mathematica environment. The second use of MathLink is to allow your program, running in the foreground, to use the Mathematica kernel in the background as a computational engine.




I am using 11.3 trial version on Ubuntu 16.04, one bug...
```
mcc addtwo.tm addtwo.c -o addtwo

/usr/bin/ld: cannot find -luuid
collect2: error: ld returned 1 exit status

Solution: sudo apt-get install libuuid1 Or uuid is a part of util-linux, git clone https://github.com/karelzak/util-linux.git 
```


### **Calling External Programs**

```
// addtwo.c

#include "mathlink.h"

int addtwo(int i, int j){
    return i+j;
}

int main(int argc, char* argv[]){
    return MLMain(argc, argv);
}


// addtwo.tm

:Begin:
:Function: addtwo
:Pattern: AddTwo[i_Integer, j_Integer]
:Arguments: { i, j }
:ArgumentTypes: { Integer, Integer }
:ReturnType: Integer
:End:

mcc addtwo.tm addtwo.c -o addtwo
```

In Mathematica, you launch the external program with the Install function:
```
link = Install["~/Desktop/addtwo"]
LinkPatterns[link] //shows what functions are defined by the external program
AddTwo[3,4]
```

### **Calling Mathematica Kernel**

```
//add.c

#include <stdio.h>
#include "mathlink.h"
int main(int argc, char * argv[ ]) {
    int i, j, sum;
    MLINK lp;
    int pkt;
    MLEnvironment env;

    printf( "Enter two integers:\n\t" );
    scanf( "%d %d", &i, &j);

    env = MLInitialize(NULL);
    if(env == NULL) return 1;
    lp = MLOpen(argc, argv); //Opening a Link to the Kernel
    if(lp == NULL) return 1;

    MLPutFunction(lp, "Plus", 2); //Sending Expressions to the Kernel
    MLPutInteger(lp, i);
    MLPutInteger(lp, j);
    MLEndPacket(lp);

    while (MLNextPacket(lp) != RETURNPKT) MLNewPacket(lp); //Receiving Expressions from the Kernel

    MLGetInteger(lp, &sum);

    printf( "sum = %d\n", sum);
    MLClose(lp);
    MLDeinitialize(env);
    return 0;
}

mcc -o add add.cpp
./add -linkname 'math -mathlink' -linkmode launch
```