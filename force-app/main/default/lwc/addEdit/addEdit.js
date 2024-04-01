import {LightningElement, api, wire, track} from 'lwc';
//[クラス名]は(3)で作成したapexクラス名です
import getObjFeildList from '@salesforce/apex/Add.getObjFeildList';
import getRules from '@salesforce/apex/Add.getRules';
// import updateRules from '@salesforce/apex/Add.updateRules';

export default class AddEdit extends LightningElement {
    @api recordId;
    @track rules;
    @track objFeildList;

    @wire(getObjFeildList)
    wiredObjFeildList({ error, data }) {
        if (data) {
            this.objFeildList = [
                {"objValue1":"", "objValue2":"","label":"選択してください"},
                ...data.Lead,
                ...data.Opportunity,
                ...data.Account,
                ...data.Contact,
            ];
        } else if (error) {
            console.log(JSON.stringify(error, null, '\t'));
        }
    }

    @wire(getRules, {recId: '$recordId'})
    wiredRules({ error, data }) {
        if (data) {
            var savedRules = JSON.parse(data);
            if (savedRules.length != 0) {
                this.rules = savedRules;
            } else {
                this.rules = [{"objValue1":"", "objValue2":""}];
            }
        } else if (error) {
            console.log(JSON.stringify(error, null, '\t'));
        }
    }

    @track noEdited = true;
    @track hasError = false;
    @track errorMsg = "";

    get isDataSizeMin() {
        return this.rules.length <= 1 ? true : false;
    }

    get isDataSizeMax() {
        return this.rules.length > 50 ? true : false;
    }

    changeObjFeildList1(e) {
        this.rules[+e.target.dataset.index].objValue1 = e.detail.value;
        this.noEdited = false;
    }

    changeObjFeildList2(e) {
        this.rules[+e.target.dataset.index].objValue2 = e.detail.value;
        this.noEdited = false;
    }

    clickAdd() {
        this.rules.push({"objValue1":"", "objValue2":""});
        this.noEdited = false;
    }

    clickDelete(e) {
        if (this.rules.length == 1) {
            this.clickAdd();
        } else {
            this.rules.splice(+e.target.dataset.index, 1);
            this.noEdited = false;
        }
    }

    clickSave() {
        this.hasError = false;
        let keys = [];
        let savedRules = JSON.parse(JSON.stringify(this.rules));
        if (!savedRules || savedRules.length == 1 && !savedRules[0].objValue1 && !savedRules[0].objValue2) {
            savedRules = [];
        }
        savedRules.forEach( v => {
            if (!v.objValue1 || !v.objValue2) {
                this.hasError = true;
                this.errorMsg = "空欄があります。";
            } else if (v.objValue1 == v.objValue2) {
                this.hasError = true;
                this.errorMsg = "同じ項目を選択しています。";
            } else {
                keys.push(v.objValue1 + v.objValue2);
            }
        });
        // if (this.hasError) { return; }
        // if ((new Set(keys)).size != savedRules.length) {
        //     this.hasError = true;
        //     this.errorMsg = "ルールが重複しています。";
        //     return;
        // }
        // savedRules = JSON.stringify(savedRules);
        // if (savedRules.length > 131072) {
        //     this.hasError = true;
        //     this.errorMsg = "ルールをこれ以上追加できません。";
        //     return; 
        // }
        // updateRules({ recId: this.recordId, newRules: savedRules })
        // .then(result => {
        //     if (result == 200) {
        //         location.reload();
        //     } else if (result == 400) {
        //         this.hasError = true;
        //         this.errorMsg = "ルールのデータ型が異なります。";
        //     } else {
        //         this.hasError = true;
        //         this.errorMsg = "ルールを追加できませんでした。";
        //     }
        // });
    }
}