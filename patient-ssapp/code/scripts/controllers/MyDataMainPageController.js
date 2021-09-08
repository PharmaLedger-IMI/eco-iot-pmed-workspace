import DsuStorage from "../services/DsuStorage.js";
const { WebcController } = WebCardinal.controllers;

const keySSIVal = "27XvCBPKSWpUwscQUxwsVDTxRcNY7dNoPQ7xBCMgRErDktEEw6eEvCGaSfpJEiRBvFhAvtk7BpbUYJv6F1EySzgaMUcBETwzmtGsYeYQhLbFXTimNA2fYChVJSzADXeomv3cwLMhrMwXGU8XYgfchtB";
// const givenKeySSI = "BBudGH6ySHG6GUHN8ogNrTWc6ir1BBhD6u3WJNJorKyvv1bBQCbg8qSwfvNfGuSBCZqWUJg6RPLjogj3r4eGjuzKy";
let testData = [] ;
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
        this.healthDataDsu.searchResources("Observation", {}, function(error, resources){
            testData = [];
            resources.forEach(value => {
               let initData = {
                   name: value.code.text,
                   value: value.valueQuantity.value,
                   unit: value.valueQuantity.unit
               };
               testData.push(initData);
            });

        });
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
                this.navigateToPageTag('clinicalData',{allData: allData});
            } else if (choice === "bpdia"){
                let allData = testData.filter(function(value){ return value.name=="Diastolic Blood Pressure";});
                this.navigateToPageTag('clinicalData',{allData: allData});
            }else if (choice === "spo2"){
                let allData = testData.filter(function(value){ return value.name=="SpO2";});
                this.navigateToPageTag('clinicalData',{allData: allData});
            }else if (choice === "weight"){
                let allData = testData.filter(function(value){ return value.name=="Weight";});
                this.navigateToPageTag('clinicalData',{allData: allData});
            } else if (choice === "height"){
                let allData = testData.filter(function(value){ return value.name=="Height";});
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