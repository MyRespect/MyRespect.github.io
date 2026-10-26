---
layout: post
title:  "Server Setup (3)"
categories: System
tags: Server
--- 

* content
{:toc}

This is a quick guide for using Deep Learning Stack Server in OTML-SEIT labs. The basic configuration of the server is: TensorEX TS4-178672310 - 2x Gold 5218R, 16GBx16 DDR4, 2x 2TB NVMe SSD, 8x 8TB SATA HDD, 8x RTX A6000, Ubuntu 20.04 w/ EMLI Container Deep Learning Stack.




### **Network**

The server is maintained by DECS and OTML-SEIT labs in MSU, so make sure you can access the EGR network in MSU before logging into the server.

- Activate your EGR Account before connecting to the server [here](https://www.egr.msu.edu/decs/myaccount/?page=activate).
- For Windows users, you can find Engineering VPN [here](https://www.egr.msu.edu/decs/how-to/new-engineering-vpn). For more information about remote access and VPN setup, please visit [DECS](https://www.egr.msu.edu/decs/).
- An alternative option is to use the jump server if you are outside of the MSU network:
```
ssh {netid}@scully.egr.ms.edu
```

### **Login**

- Use ssh to log in as below: `ssh {netid}@otml-set.egr.ms.edu`		_**I miss U :)**_
- **/home/{netid}/**: Upon logging in you’ll have your usual EGR home directory at /home/{netid}, we do not recommend you do storage in the home folder. Instead, we have two other options.
- **/localscratch/ and /localscratch2/**: Each is individual and non-redundant, but very durable; this way there is roughly 7TB worth of fast storage available for working from. Both of these are where other groups have their users make themselves a folder for their own access (named with their netid for ease of identification)
- **/storage/**: It is slower than the NVMe, but has about 42 TB total usable; it is set up to allow the failure of 2 of the 8 drives without data loss. It is highly recommended that running your data from scratch, and then once results are done and ready to be archived/whatever, you can just copy/move them to /storage.

### **Softwares**

#### **Anaconda**

Do not install anaconda in your home folder since it will be large like 3.5G+. Instead, follow [conda install](https://docs.conda.io/projects/conda/en/latest/user-guide/install/linux.html) to install anaconda. Here is recommended:
```
/localscratch/{netid}/anaconda3

conda list
conda env list
conda create -n your_env_name python=X.X
conda install -n your_env_name [package]
conda remove -n python36 --all
conda activate your_env_name
source activate your_env_name
```

#### **Virtualenv**

Virtualenv is a tool to create isolated Python environments. Follow [virtualenv install](https://virtualenv.pypa.io/en/latest/installation.html) to install virtualenv. In most cases, you will not need the sudo permission under virtualenv.

#### **Pytorch and Tensorflow**

Follow [pytorch install](https://pytorch.org/get-started/locally/) and [tensorflow install](https://www.tensorflow.org/install) here to install these two software.

- The default GPU for OTML Lab (Prof. Liu)  is GPU '0', '1', '2', '3'.

- The default GPU for SEIT Lab (Prof. Yan)  is GPU '4', '5', '6', '7'.

**Be sure not to use multiple GPUs at the same time if one is enough!** If the other lab would like to use their default GPUs, you need to kill the jobs ASAP. Here are some ways to specify the number of GPUs you can use:
```
export CUDA_VISIBLE_DEVICES=4 # Command example to use GPU '4'
python example.py
****************************************
CUDA_VISIBLE_DEVICES=4 python example.py
****************************************
os.environ["CUDA_VISIBLE_DEVICES"] = "4,5,6,7" # Command example to use GPU '4', must set before 'import torch'
****************************************
config = tf.ConfigProto()
config.gpu_options.allow_growth = True # allocate gpu according to its need
config.gpu_options.per_process_gpu_memory_fraction = 0.4 # specifiy GPU memory fraction
****************************************
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
```

#### **Tmux and Screen**

Tmux is a terminal multiplexer: it enables a number of terminals to be created, accessed, and controlled from a single screen. Tmux may be detached from a screen and continue running in the background, then later reattached. It is recommended to choose Tmux, and you can find a good guide to Tmux [HERE](https://www.hamvocke.com/blog/a-quick-and-easy-guide-to-tmux/). 

 Here are some example usages:
```
tmux new -s <session-name>
tmux detach
tmux attach -t <session-name>
tmux kill-session -t <session-name>
tmux switch -t <session-name>
```

An alternative choice is to use screen. You can start a screen session and then open any number of windows (virtual terminals) inside that session. Processes running in Screen will continue to run when their window is not visible even if you get disconnected. Here are some example usages:
```
sudo apt install screen
screen -S yourname # create a named session， 
screen -r yourname # reattach to your session
screen -d -r yourname # deattach and reattach to your session
screen -ls # list all sessions

Ctrl-A-Esc to see more content on the screen; Esc to exit the mode;
your_command|less to see more content;
```

### **MISC**

Here are some other commands you may find helpful.

#### **Git**

Here are some git commands in case you may use git on the server:
```
git status  # check git status
git add -A	# Add all new and changed files to the staging area
git commit -m "[commit message]" # Commit changes
git push -u origin [branch name] # Push changes to the remote repository (and remember the branch)
git diff file # Preview changes before merging
git checkout # Switch to a branch and discard the changes
git reset HEAD file # Discard changes in the staging area
```

#### **GPU usage**

Use the below command for a breakdown of the GPU usage:
```
nvidia-smi
watch -n 1 nvidia-smi
```

#### **File Transfer**

Here are some recommendations for transferring files: 
```
scp, rz/sz, FileZilla
```

#### **File System**

Ubuntu mount HPCC [Reference](https://tecadmin.net/install-sshfs-on-linux-and-mount-remote-filesystem/):
```
sshfs user-name@hpcc.ms.edu:/mnt/home/user-name/ ./hpcc
sshfs user-name@otml-set.egr.ms.edu:/localscratch/user-name/ ./otml-set
```

One thing that causes my disk being full is that the ~/.local/share/Trash becomes more than 300 GB.

```
du: disk usage, '-s' means summary, '-h' means human readable
    du -sh /home/name/* | sort -hr
    du -h --max-depth=1 /home/name/
df: disk free, '-h' means human readable
    df -h
```

#### **JupyterLab**

* Install Jupyterlab on the server. You may use conda to install.
* Start Jupyterlab with no browser. You may need to activate the environment such as "conda activate dgl". 
```
jupyter lab --no-browser --ip "*" --notebook-dir /localscratch/user-name/
```
* Create a Screen: screen -S jupyter

* You need to ssh in local terminal: ssh -L 8888:127.0.0.1:8888 user-name@otml-set.egr.ms.edu

_**I miss U :)**_

#### **Windows Related**

Recycle bin gets problem: dropped file are deleted permanately.

```
Solution: rd /s /q C:\$Recycle.bin
```