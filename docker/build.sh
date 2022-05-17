#!/bin/bash

docker build -t paiuscatalin/iot-pmed "$(dirname $(readlink -f $0))" --no-cache --network host
