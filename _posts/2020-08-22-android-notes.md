---
layout: post
title:  "Android Notes"
categories: System
tags: Android Sensor
--- 

* content
{:toc}

Some notes about Android Development. I have taken "CSE 476 Mobile Application Development" at MSU, but to avoid leaking course materials, I will just keep them in my mind _HOPEFULLY_.




### **Basic Java**

- JNI: Java Native Interface, which is a feature of Java，making Jave interacts with other programming languages; For example, Java calls C++; C++ calls Java.

- NDK: Native Development Kit, which helps to develop C++ dynamic library and automatically package shared libraries and applications into APKs．

- Android.mk formulates the configuration information for source code compilation, and Application.mk configures the relevant content of the compilation platform;

### **Sensors**

- Location: longitude, latitude, and altitude

- Accelerometer: gravity and linear accelerometer

- Gyroscope: measuring the rotation speed of the device, mostly required for games like 3D racing

- Proximity: check whether there is some obstacle at a very close distance to your device.

- Orientation: magnetic field force in 3-axis space, z is related to the magnetic north pole(0 means the top of your phone points to the north pole), x is related to the ground (90 means the phone is standing vertically), y shows roll (0 means the phone is facing to the sky, 180 means the screen is facing the ground).