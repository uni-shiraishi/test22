public with sharing class Add {
    // 「リード」「商談」「取引先」「取引先責任者」のオブジェクトリスト
    static final List<String> OBJECTS_LIST = new List<String>{
        'Lead', 'Opportunity', 'Account', 'Contact'
    };

    public static List<Opportunity> getRecord(id recId) {
        return [SELECT Add__c FROM Opportunity WHERE id =: recId];
    }    

    @AuraEnabled(cacheable=true)
    public static String getRules(id recId) {
        Opportunity record = getRecord(recId)[0];
        if (record.Add__c != null) { return record.Add__c; }
        return '[]';
    }
    
    // @AuraEnabled
    // public static Integer updateRules(id recId, String newRules) {
    //     try {
	//     if (newRules.length() > 13107) { return 400; }
    //         List<Object> overwriteInfo = (List<Object>)JSON.deserializeUntyped(newRules);
    //         for (Object info: overwriteInfo){
    //             Map<String, Object> infoMap = (Map<String, Object>)info;
    //             List<String> objValue1 = ((String)(infoMap.get('objValue1'))).split(':');
    //             List<String> objValue2 = ((String)(infoMap.get('objValue2'))).split(':');
    //             if (objValue1.size() != 2 || objValue2.size() != 2 || objValue1 == objValue2) { return 400; }
    //             Schema.DisplayType v1 = getTypeByObjField(objValue1[0], objValue1[1]);
    //             Schema.DisplayType v2 = getTypeByObjField(objValue2[0], objValue2[1]);
    //             if (v1 != v2) { return 400; } 
    //         }
    //         List<Add__c> records = getRecord(recId);
    //         records[0].Add__c = newRules;
    //         update records;
    //         return 200;
    //     } catch(DmlException e) {
    //         return 500;
    //     }
    // }

    public static Schema.DisplayType getTypeByObjField(String objName, String fieldName) {
        return Schema.getGlobalDescribe().get(objName).getDescribe().fields.getMap().get(fieldName).getDescribe().getType();
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, List<ApiLabelValue>> getObjFeildList(id recId) {
        Map<String, List<ApiLabelValue>> result = new Map<String, List<ApiLabelValue>>();
        for (String objName: OBJECTS_LIST){
            sObject sObj = getSObject(objName);
            result.put(objName, getApiLabelValue(sObj));
        }
        return result;
    }

    public static sObject getSObject(String objName) {
        return Schema.getGlobalDescribe().get(objName).newSObject();
    }

    public static DescribeSObjectResult getSObjectDescribe(sObject sObj) {
        return sObj.getSObjectType().getDescribe();
    }

    public static List<ApiLabelValue> getApiLabelValue(sObject sObj) {
        DescribeSObjectResult sObjectDescribe= getSObjectDescribe(sObj);
        Map<String, SObjectField> sObjectFields = sObjectDescribe.fields.getMap();
        String objName = sObjectDescribe.getName();
        String objLabel = sObjectDescribe.getLabel();
        List<ApiLabelValue> result = new List<ApiLabelValue>{};
        for(SObjectField f : sObjectFields.values()) {
            DescribeFieldResult field  = f.getDescribe();
            if (field.isUpdateable()) {
                String label = '【' + objLabel + '】' + field.getLabel();
                String value = objName + ':' + field.getName();
                ApiLabelValue fields = new ApiLabelValue(label, value);
                result.add(fields);
            }
        }
        return result;
    }

    public class ApiLabelValue{
        @AuraEnabled
        public String label; 
        @AuraEnabled
        public String value;
        public ApiLabelValue(String l, String v) {
            label = l; value = v;
        }
    }
}