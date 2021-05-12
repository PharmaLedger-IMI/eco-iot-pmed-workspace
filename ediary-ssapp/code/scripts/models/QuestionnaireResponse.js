export default {
    example: {
        "resourceType": "QuestionnaireResponse",
        "id": "bb",
        "text": {
            "status": "generated",
            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"></div>"
        },
        "status": "completed",
        "subject": {
            "reference": "http://hl7.org/fhir/Patient/1",
            "type": "Patient"
        },
        "authored": "2013-02-19T14:15:00+10:00",
        "author": {
            "reference": "http://hl7.org/fhir/Practitioner/example",
            "type": "Practitioner"
        },
        "item": [
            {
                "linkId": "sex",
                "text": "Sex",
                "answer": [
                    {
                        "valueCoding": {
                            "code": "f"
                        }
                    }
                ]
            },
            {
                "linkId": "birthWeight",
                "text": "Birth weight (kg)",
                "answer": [
                    {
                        "valueDecimal": 3.25
                    }
                ]
            },
            {
                "linkId": "vitaminKDose2",
                "text": "2nd dose",
                "answer": [
                    {
                        "valueDate": "1972-12-11"
                    }
                ]
            },
            {
                "linkId": "abnormalitiesAtBirth",
                "text": "Abnormalities noted at birth",
                "answer": [
                    {
                        "valueString": "Already able to speak Chinese"
                    }
                ]
            }
        ]
    }
}
