public with sharing class OpportunityController {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunityList(Id accountId) {
        return [
            SELECT
                Id,
                Name,
                StageName,
                Cost__c
            FROM Opportunity
            WHERE
                AccountId = :accountId
            LIMIT 10
        ];
    }
}