import { LightningElement, wire } from 'lwc';
import getopportunitys from '@salesforce/apex/OpportunityController.getOpportunityList';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import COST__C_FIELD from '@salesforce/schema/Opportunity.Cost__c';

const COLS = [
    { label: '費目', fieldName: COST__C_FIELD.fieldApiName,
    type: '人件費',
    editable: true 
    },
];
export default class DatatableInlineEditWithUiApi extends LightningElement {
    columns = COLS;
    draftValues = [];

    // Using Apex to fetch records while waiting for a replacement to getListUi() which is deprecated
    @wire(getopportunitys)
    opportunitys;

    async handleSave(event) {
        // Convert datatable draft values into record objects
        const records = event.detail.draftValues.slice().map((draftValue) => {
            const fields = Object.assign({}, draftValue);
            return { fields };
        });

        // Clear all datatable draft values
        this.draftValues = [];

        try {
            // Update all records in parallel thanks to the UI API
            const recordUpdatePromises = records.map((record) =>
                updateRecord(record)
            );
            await Promise.all(recordUpdatePromises);

            // Report success with a toast
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contacts updated',
                    variant: 'success'
                })
            );

            // Display fresh data in the datatable
            await refreshApex(this.opportunitys);
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while updating or refreshing records',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }
}