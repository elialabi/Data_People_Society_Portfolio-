#! python3.4
###demo code provided by Steve Cope at www.steves-internet-guide.com
##email steve@steves-internet-guide.com
###Free to use for any purpose
"""
sends mesages 
"""
import paho.mqtt.client as mqtt
import os
import time
import sys, getopt
import logging
import queue
import random
import json
##### User configurable data section
time_stop=0 #set to 0 for infinite loop
username=""
password=""



options=dict()
brokers=["192.168.1.33","192.168.1.157","192.168.1.206","192.168.1.85","broker.hivemq.com",\
         "test.mosquitto.org","iot.eclipse.org"]
options["broker"]=brokers[0]
options["port"]=1883
options["verbose"]=False
options["cname"]="test-monitor"
options["interval"]=2 #loop time when client publishes
options["keepalive"]=120
options["loglevel"]=logging.WARNING

r=random.randrange(1,10000)
cname="monitor-"+str(r)
mqttclient_log= False
#display=True #set to display messages on console
##############helper functions
def convert(t):
    d=""
    for c in t:  # replace all chars outside BMP with a !
            d =d+(c if ord(c) < 0x10000 else '!')
    return(d)
def print_out(m):
    if display:
        print("\n",m)
##############


def on_log(client, userdata, level, buf):
    print("log: ",buf)

def on_connect(client, userdata, flags, rc):
    logging.debug("Connected flags"+str(flags)+"result code "\
    +str(rc)+"client1_id")
    if rc==0:
        client.connected_flag=True
    else:
        client.bad_connection_flag=True

def on_disconnect(client, userdata, rc):
    logging.debug("disconnecting reason  " + str(rc))
    client.connected_flag=False
    client.disconnect_flag=True
    client.subscribe_flag=False
def on_publish(client, userdata, mid):
    logging.info("pub ack "+ str(mid))
    client.puback_flag=True
    
def Initialise_client_object():
    mqtt.Client.last_pub_time=time.time()
    mqtt.Client.run_flag=True
    mqtt.Client.subscribe_flag=False
    mqtt.Client.sensor_status_old=None
    mqtt.Client.bad_connection_flag=False
    mqtt.Client.connected_flag=False
    mqtt.Client.disconnect_flag=False
    mqtt.Client.disconnect_time=0.0
    mqtt.Client.disconnect_flagset=False
    mqtt.Client.pub_msg_count=0

def Initialise_clients(cname):
    #flags set
    client= mqtt.Client(cname,False) #don't use clean session
    if mqttclient_log: #enable mqqt client logging
        client.on_log=on_log
    client.on_connect= on_connect        #attach function to callback
    client.on_publish=on_publish
    return client



    
########################main program
#main start
topics_in=[]
   
##logging
logging.basicConfig(level="WARNING")
#use DEBUG,INFO,WARNING


#############
if username !="":
    client.username_pw_set(username, password)


loopflag=True #
##start connection process
badcount=0 # counter for bad connection attempts
verbose=options["verbose"]
Initialise_client_object()
r=random.randrange(1,1000)
cname="logtest-"+str(r)
client=Initialise_clients(cname)#create and initialise client object

print("Starting Use CTRL+C to stop")
msg="This is a test message"
msg="test message "*200
#print(msg)


r=random.randrange(1,100)
tname="sensor-"+str(r)
client.connect(options["broker"],options["port"])
while not client.connected_flag:
    client.loop(0.01)
    time.sleep(0.25)


def get_status(count):
    if count%10 ==0:
        status="off"
    else:
        status="on"

    return status
topic_out="test"

delays=[0.1,0.005,0.001]
delay=delays[0]

count=1
stime=time.time()

mcount=1
loops=10000
loops=100
topic_logger=True
#topic_logger=False
logging_test_json=True
#logging_test_json=False
topic1="test/test1/sensor1"
topic2="test/sensor2"
topic3="test/sensor3"       
topic4="test/sensor5"
topic6="test/sensor6" 
try:
    while count<=loops:
        client.loop(0.001)

        status=str(get_status(count))       
        
        if logging_test_json and not topic_logger:
            m={"sensor":"sensor1","count":mcount,"status":status}
            msg_out=json.dumps(m)
            client.publish(topic_out,msg_out)
            #print ("here")
        if logging_test_json and topic_logger:
            print ("here111 ",mcount)
            #m={"sensor":"sensor1","count":mcount,"status":status}
            #m2={"sensor":"sensor2","count":mcount,"status":status}
            #m3={"sensor":"sensor3","count":mcount,"status":status}
            m={"ms":115318,"Urms":0,"Umin":0,"Umax":87,"count":mcount}
            m2={"ms":116318,"Urms":0,"Umin":0,"Umax":42}
            m3={"ms":116318,"Urms":0,"Umin":0,"Umax":42}
            m4={"ms":117318,"Urms":0,"Umin":0,"Umax":26,"count":mcount}
            msg_out=json.dumps(m)
            print("pub1"+msg_out)
            client.publish(topic1,msg_out)
            mcount+=1
            msg_out=json.dumps(m2)
            client.publish(topic2,msg_out)
            mcount+=1
            msg_out=json.dumps(m3)
            client.publish(topic3,msg_out)
            mcount+=1
            msg_out=json.dumps(m4)
            client.publish(topic4,msg_out)
            mcount+=1
            #print(msg_out)
        if topic_logger and not logging_test_json:
            print ("here2")
            msg_out=status
            client.publish(topic1,msg_out)
            mcount+=1
            client.publish(topic2,msg_out)
            mcount+=1
            #print("message ",msg_out)
        if not topic_logger and not logging_test_json:
            mcount+=1
            msg_out=status
            client.publish(topic_out,msg_out)
            print ("here3")
            #print("message ",msg_out)

        
        time.sleep(delay)
        count+=1


        
       
except KeyboardInterrupt:
    print("interrrupted by keyboard")

mcount=mcount-1

print("messages sent ",mcount)
print("messages sent loop count ",count-1)
time_taken=time.time()-stime
print("time taken = ",time_taken)
message_rate=mcount/time_taken

print("message_rate ",message_rate," per second")
msg_out={"messages":mcount,"time taken":time_taken,"message_rate":message_rate}


#print("total number of messages analysed=",message_count," displayed ",message_count2)
