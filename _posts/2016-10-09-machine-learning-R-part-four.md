---
layout: post
title:  "Machine Learning with R (4)"
categories: AI
tags: NN SVM
--- 

* content
{:toc}  

Now I start to learn neural networks and SVM. Actually, I am a little bit more familiar with those two parts than other machine learning methods. However, the mathematics behind SVM or DNN  is some kind of complicated, I will skip the details in the post.




### **Neural Network**

First popularize a little biological knowledge. The dendrites of biological neuronal cells receive input signals through a biochemical process in which nerve impulses are weighted according to their relative importance or frequency. So what is this biochemical process? The cell body begins to accumulate input signals, and when a threshold is reached, the cell explodes with vigor, and the output signal is sent through an electrochemical process to the axon, where it is processed into a chemical signal that travels through the axon terminal. A tiny gap that becomes the synapse transmits to neighboring neurons.

The essentials of neural networks: activation functions, network topology. The following describes the process of the backpropagation (BP) neural network. In the forward stage, the sequence of neurons from the input layer to the output layer is activated. Each neuron's weight and activation function are applied along the way. Once the last layer is reached, an output signal is generated. In the backward stage, the network output signal generated by the forward stage is compared with the real target value of the training data, and the error between them is propagated backward, thereby correcting the connection weights between neurons and reducing future errors.

```
m<-neuralnet(target ~ predicetions, data=mydata, hidden=1);
p<-compute(m,test);
```

### **SVM**

The support vectors are the points in each class that are closest to the maximum-margin hyperplane.

There are several kernel functions such as the Linear kernel function, S-type kernel function, and Gaussian RBF kernel function.

```
m<-ksvm(target~predictions, data=mydata, kernel="rbfdot",c=1); p<-predict(m, test, type="response")
```