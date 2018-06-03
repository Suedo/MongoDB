/********************************************************************************
Homework: Chapter 2
********************************************************************************

In this lab, we are going to get you to start identifying issues with a single
mongod instance. First, we start by launching a single mongod using the
configuration file single.cfg:

    mongod --config /shared/single.cfg

Second, you should launch a small script, that is also available with this
lab handouts, called singleapp.py:

    python /shared/singleapp.py

Both of these steps need to be launched from within our vagrant environment
`m312-vagrant-env`. To be able to launch both the mongod and the python script,
you need to make sure that the vagrant image has access to the handout material.
To do that, you need to:

    - Launch this vagrant environment (steps covered in previous lab)
    - Download this lab handouts
    - Copy both files ,**single.cfg** and singleapp.py, into the vagrant
      environment /shared folder

        cp single.cfg m312-vagrant-env/shared
        cp singleapp.py m312-vagrant-env/shared

    - And run the previously described commands

Given this single.cfg configuration and the singleapp.py application, a few
issues will be logged in the mongod log file.

Which MongoDB component is reporting these issues ? Ignore any filesystem or
access control warnings!

------------------------------------------------------------------------------*/

// Answer:  Format of log data:  <timestamp> <severity> <component> [<context>] <message>

    2017-07-22T10:41:13.648+0000 I NETWORK  [thread1] connection accepted from 127.0.0.1:51936 #18 (9 connections now open)
    2017-07-22T10:41:13.648+0000 I NETWORK  [conn11] received client metadata from 127.0.0.1:51936 conn11: { driver: { name: "PyMongo", version: "3.4.0" }, os: { type: "Linux", name: "Ubuntu 14.04 trusty", architecture: "x86_64", version: "3.13.0-125-generic" }, platform: "CPython 2.7.6.final.0" }
    2017-07-22T10:41:13.652+0000 I NETWORK  [thread1] connection accepted from 127.0.0.1:51937 #19 (10 connections now open)
    2017-07-22T10:41:13.652+0000 I NETWORK  [conn12] received client metadata from 127.0.0.1:51937 conn12: { driver: { name: "PyMongo", version: "3.4.0" }, os: { type: "Linux", name: "Ubuntu 14.04 trusty", architecture: "x86_64", version: "3.13.0-125-generic" }, platform: "CPython 2.7.6.final.0" }
    2017-07-22T10:41:13.659+0000 I NETWORK  [thread1] connection accepted from 127.0.0.1:51938 #20 (11 connections now open)
    2017-07-22T10:41:13.659+0000 I NETWORK  [thread1] connection refused because too many open connections: 10
    2017-07-22T10:41:13.659+0000 I NETWORK  [thread1] connection accepted from 127.0.0.1:51939 #21 (11 connections now open)


// ^^ As we see from the above, the NETWORK component is throwing the issues when
// running the python application because of a maximum connections limit


================================================================================
