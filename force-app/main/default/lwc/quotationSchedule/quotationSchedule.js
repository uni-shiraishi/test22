import { LightningElement , wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import { reduceErrors } from 'c/ldsUtils';
import si_QuotationSchedule__c_OBJECT from '@salesforce/schema/si_QuotationSchedule__c';
import ScheduleName__c_FIELD from '@salesforce/schema/si_QuotationSchedule__c.ScheduleName__c';
import EndDate__c_FIELD from '@salesforce/schema/si_QuotationSchedule__c.EndDate__c';
import StartDate__c_FIELD from '@salesforce/schema/si_QuotationSchedule__c.StartDate__c';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';


export default class QuotationSchedule extends LightningElement {

    @wire(getObjectInfo, { objectApiName: si_QuotationSchedule__c_OBJECT })
    si_QuotationSchedule__cObjectInfo;

    @wire(getPicklistValues, { 
            recordTypeId: '$si_QuotationSchedule__cObjectInfo.data.defaultRecordTypeId', 
            fieldApiName: ScheduleName__c_FIELD })
            ScheduleName__cOptions;


            
    si_QuotationSchedule__cId;
    ScheduleName__c = '';
    EndDate__c = '';
    StartDate__c = '';

    get options() {
        return [
            { label: '要件定義', value: '要件定義' },
            { label: '基本設計', value: '基本設計' },
            { label: 'PG', value: 'PG' },
            { label: 'テスト', value: 'テスト' },
            { label: '連携テスト', value: '連携テスト' },
        ];
    }


    
    handleNameChange(event) {
        this.quotationScheduleId = undefined;
        this.ScheduleName__c = event.target.value;
        this.EndDate__c = event.target.value;
        this.StartDate__c = event.target.value;
    }

    async createsi_QuotationSchedule__c() {
        const fields = {};
        fields[ScheduleName__c_FIELD.fieldApiName] = this.ScheduleName__c;
        fields[EndDate__c_FIELD.fieldApiName] = this.EndDate__c;
        fields[StartDate__c_FIELD.fieldApiName] = this.StartDate__c;
        const recordInput = { apiName: si_QuotationSchedule__c_OBJECT.objectApiName, fields };
        try {
            const quotationSchedule = await createRecord(recordInput);
            this.QuotationScheduleId = quotationSchedule.id;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'si_QuotationSchedule__c created',
                    variant: 'success'
                })
            );
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: reduceErrors(error).join(', '),
                    variant: 'error'
                })
            );
        }
    }
}
