#!/bin/bash

docker build -t eco-iot-pmed "$(dirname $(readlink -f $0))" --no-cache --network host
