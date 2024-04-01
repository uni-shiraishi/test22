import { LightningElement,track } from 'lwc';
import { createRecord } from "lightning/uiRecordApi";

export default class quotation extends LightningElement {
    @track si_QuotationSchedule__cScheduleName__c;
    @track si_QuotationSchedule__cStartDate__c;
    @track si_QuotationSchedule__cEndDate__c;

    si_QuotationSchedule__cScheduleName__cChangeHandler(event){
        this.si_QuotationSchedule__cScheduleName__c = event.target.value;
    }

    si_QuotationSchedule__cStartDate__cChangeHandler(event){
        this.si_QuotationSchedule__cStartDate__c = event.target.value;
    }

    si_QuotationSchedule__cEndDate__cChangeHandler(event){
        this.si_QuotationSchedule__cEndDate__c = event.target.value;
    }

    createSi_QuotationSchedule__c(){
        const fields = {'ScheduleName__c' : this.si_QuotationSchedule__cScheduleName__c, 'StartDate__c' : this.si_QuotationSchedule__cStartDate__c, 'EndDate__c': this.si_QuotationSchedule__cEndDate__c};
        const recordInput = {apiName : 'Account', fields};

        createRecord(recordInput).then(response => {
            console.log('Account has been created : ', response.id);
        }).catch(error =>{
            console.error('Error in creating account : ', error.body.message);
        });
    }

}
