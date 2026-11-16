---
layout: post
title:  "Celery Notes"
categories: System
tags: Celery RabbitMQ
--- 

* content
{:toc}

Celery is a distributed system to process vast amounts of messages while providing operations with the tools requires to maintain such a system. It is a task queue with a focus on real-time processing, while also supporting task scheduling.




Celery architecture consists of three parts: message broker, worker and task result store. Before operating celery in detail, let's introduce a few concepts.

### **Producer-Consumer**

The producer is the module responsible for generating data; the consumer is the module responsible for processing data. The broker acts as a buffer between the producer and the consumer. The producer puts the data into the buffer, and the consumer takes the data out of the buffer; this buffer plays the role of "decoupling";

In asynchronous communication, the message will not reach the receiver immediately but will be stored in a container. When certain conditions are met, the message will be sent to the receiver by the container. This container is the message queue. To complete this function, both parties and the container are required to abide by the unified conventions and rules. AMQP (advanced message queuing protocol) is such a protocol, and RabbitMQ is a message-queuing product based on AMQP.

The main elements included in AMQP: are the producer publishes the message; the consumer obtains the message from the message queue; the message queue is used to save the message. The exchanger is the routing component that accepts the message sent by the producer and forwards the message route to the message queue; The virtual host is a collection of switches, message queues, and related objects. A channel is an independent bidirectional data flow channel in a multiplexed connection, providing a physical transmission medium for a session.

```
publisher--publish-->exchange--routes-->queue--consume-->consumer
```

### **Celery with Django**

[Celery Reference](http://docs.celeryproject.org/en/latest/):

```
celery -A petct worker -l info --pidfile id.txt 
# The --pidfile argument can be set to an absolute path to avoid  having other old workers still running.
```

#### **Add Task**
```
# tasks.py

from __future__ import absolute_import, unicode_literals
from celery import shared_task
from celery.decorators import task
from celery.utils.log import get_task_logger
from .draw3d import loadArray

logger = get_task_logger(__name__)

@shared_task(name="loadArray")
def loadArray_task(filepath, shape):
    logger.info("load 3d array")
    return loadArray(filepath, shape)



# views.py

from .tasks import loadArray_task

def show(request):
    if request.method == 'GET':
        filePos=request.GET.get("userID", None)
        record=Record.objects.get(userID=filePos)

        global mydict
        if filePos not in mydict:
            loadtask=loadArray_task.delay("./file.mpv", (110,110,187))
            mydict[filePos]=loadtask.get(timeout=1)

        return render(request, 'show.html', {'record': record})
```

#### **Periodic Tasks**

Scheduling a task to run at a specific time, [Refer](https://realpython.com/asynchronous-tasks-with-django-and-celery/).

```
# tasks.py
# we run the save_latest_flickr_image() function every fifteen minutes by wrapping the function call in a task. 

from celery.task.schedules import crontab
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger

from photos.utils import save_latest_flickr_image

logger = get_task_logger(__name__)

@periodic_task(
    run_every=(crontab(minute='*/15')),
    name="task_save_latest_flickr_image",
    ignore_result=True
)
def task_save_latest_flickr_image():
    """
    Saves latest image from Flickr
    """
    save_latest_flickr_image()
    logger.info("Saved image from Flickr")
```

We can also run the job remotely using *Supervisor*. We need to tell Supervisor about our Celery workers by adding configuration files to the “/etc/supervisor/conf.d/” directory on the remote server. In our case, we need two such configuration files - one for the Celery worker and one for the Celery scheduler.