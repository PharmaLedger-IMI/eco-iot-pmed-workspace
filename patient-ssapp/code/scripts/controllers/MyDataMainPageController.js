const { WebcController } = WebCardinal.controllers;
import DsuStorage from "../services/DsuStorage.js";


const keySSIVal = "27XvCBPKSWpUwscQUxwsVDTxRcnT4pgXppnC4eKhpctT2BsVgTv3tpygc1GLehL9jEsWYKSVbJQeWykZRiC3vwXM485VsszH5JCw3jCfHXdRNf3Y3NafdJZQjVa4z5j7GMvcB2naEjrbrsBTm8ELdNw";
// const givenKeySSI = "BBudGH6ySHG6GUHN8ogNrTWc4qy2hWpSRGr1ZNsKsLEgDjnAm5FpV29n8eC1ke8YhDmFV2cvGwJwAC1WuYkKjqWa3";
var testData = [] ;
const ViewPersonalHealthDataModel = {

    name: {
        name: 'NAME',
        label: "name",
        value: 'name'
    },
    id: {
        name: 'ID',
        label: "id",
        value: 'id'
    },
    mydata: {
        label: "Choose one or multiple options to see your data:",
        required: true,
        options: [
            {
                label: "All records",
                value: 'all'
            },
            
            {
                label: "Systolic Blood Pressure",
                value: "bpsys"
            },
            {
                label: "Diastolic Blood Pressure",
                value: "bpdia"
            },
            {
                label: "SpO2",
                value: "spo2"
            },
            {
                label: "Weight",
                value: "weight"
            },
            {
                label: "Height",
                value: "height"
            }
        ],
        value: ''
    }

}


export default class MyDataMainPageController extends  WebcController  {
    constructor(...props) {
        super(...props);
       
        this.model = ViewPersonalHealthDataModel ;
        this.healthDataDsu =  new DsuStorage({
            keySSI: keySSIVal,
            dbName: "sharedDB"
        });
        // dsu.searchResources(resourceType, params, callback);
        this.healthDataDsu.searchResources("Observation", {}, function(error, resources){
            testData = [];
            console.log(error);
            resources.forEach(value => {
               let initData = {
                   name: value.code.text,
                   value: value.valueQuantity.value,
                   unit: value.valueQuantity.unit
               };
               testData.push(initData);
            });

        });
        console.log("***************************** All MyData Values *******************************************");
        console.log(testData);

        if (this.getState()){
            let receivedModel = this.getState();
            console.log("Welcome: " + receivedModel.nameId);
            this.model.name = receivedModel.nameId
            this.model.id   = receivedModel.profileId
        }

        this._attachHandlerGoBack()


        let radioSubmitData = () => {
            
            
            let choice = this.model.mydata.value;
            console.log(choice);
            if (choice === "all"){
                let allData = testData;
               
                this.navigateToPageTag('clinicalData',{allData: allData});
            } else if (choice === "bpsys"){
               
                let allData = testData.filter(function(value){ return value.name=="Systolic Blood Pressure";});
                console.log("***************************** Systolic Blood Pressure *******************************************");

                console.log(allData);
                this.navigateToPageTag('clinicalData',{allData: allData});
            } else if (choice === "bpdia"){
                console.log("***************************** Diastolic Blood Pressure *******************************************");

                let allData = testData.filter(function(value){ return value.name=="Diastolic Blood Pressure";});
                console.log(allData);
                this.navigateToPageTag('clinicalData',{allData: allData});
            }else if (choice === "spo2"){
                let allData = testData.filter(function(value){ return value.name=="SpO2";});
                console.log("***************************** SpO2 *******************************************");
                console.log(allData);
                this.navigateToPageTag('clinicalData',{allData: allData});
            }else if (choice === "weight"){
                let allData = testData.filter(function(value){ return value.name=="Weight";});
                console.log("***************************** Weight *******************************************");
                console.log(allData);
                this.navigateToPageTag('clinicalData',{allData: allData});
            } else if (choice === "height"){
                let allData = testData.filter(function(value){ return value.name=="Height";});
                console.log("***************************** Height *******************************************");
                console.log(allData);
                this.navigateToPageTag('clinicalData',{allData: allData});
            }
             
        }

        this.on("Show Data",radioSubmitData,true);


    }


    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }

   

}