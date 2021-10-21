FROM node:12.16.0

RUN npm install -g node-gyp

RUN git clone https://github.com/PharmaLedger-IMI/iot-pmed-workspace.git iot-pmed-workspace

WORKDIR iot-pmed-workspace

COPY ./trust-loader-config ./trust-loader-config

RUN ls && npm run dev-install --unsafe-perm

RUN echo 'npm run server & \n sleep 1m \n npm run build-all \n tail -f /dev/null' >> startup-script.sh

ENTRYPOINT ["sh", "startup-script.sh"]
