export default {
    example: {
        "resourceType": "Questionnaire",
        "id": "bb",
        "text": {
            "status": "generated",
            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"></div>"
        },
        "url": "http://hl7.org/fhir/Questionnaire/bb",
        "title": "NSW Government My Personal Health Record",
        "status": "draft",
        "subjectType": [
            "Patient"
        ],
        "date": "2013-02-19",
        "publisher": "New South Wales Department of Health",
        "jurisdiction": [
            {
                "coding": [
                    {
                        "system": "urn:iso:std:iso:3166",
                        "code": "AU"
                    }
                ]
            }
        ],
        "item": [
            {
                "linkId": "nameOfChild",
                "text": "Enter your name:",
                "type": "string"
            },
            {
                "linkId": "birthWeight",
                "text": "Birth weight (kg)",
                "type": "decimal"
            },
            {
                "linkId": "vitaminiKDose1",
                "text": "Your birthday",
                "type": "dateTime"
            },
            {
                "linkId": "annoying_patch",
                "text": "How annoying was it to keep the patch applied to the chest? (0 No hassle – 10 Maximum annoyance)",
                "type": "choice",
                "answerOption": [
                    {
                        "valueCoding": {
                            "code": "0"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "1"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "2"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "3"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "4"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "5"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "6"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "7"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "8"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "9"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "10"
                        }
                    }
                ]
            },
            {
                "linkId": "difficult_send",
                "text": "How difficult was it to send data daily to the Virtual Clinic? (0 Not at all difficult – 10 Maximum difficulty)",
                "type": "choice",
                "answerOption": [
                    {
                        "valueCoding": {
                            "code": "0"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "1"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "2"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "3"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "4"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "5"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "6"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "7"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "8"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "9"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "10"
                        }
                    }
                ]
            },
            {
                "linkId": "hard_contact",
                "text": "How hard was it to contact the Virtual Clinic nurse? (0 Not at all difficult – 10D maximum difficulty)",
                "type": "choice",
                "answerOption": [
                    {
                        "valueCoding": {
                            "code": "0"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "1"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "2"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "3"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "4"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "5"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "6"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "7"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "8"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "9"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "10"
                        }
                    }
                ]
            },
            {
                "linkId": "helpful_support",
                "text": "How helpful was the virtual clinic nurse's support when you contacted him? (0 Not at all useful – 10 Very useful)",
                "type": "choice",
                "answerOption": [
                    {
                        "valueCoding": {
                            "code": "0"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "1"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "2"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "3"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "4"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "5"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "6"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "7"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "8"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "9"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "10"
                        }
                    }
                ]
            },
            {
                "linkId": "security_remote",
                "text": "How much security did the remote monitoring system give you? (0 No security – 10 A lot of security)",
                "type": "choice",
                "answerOption": [
                    {
                        "valueCoding": {
                            "code": "0"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "1"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "2"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "3"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "4"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "5"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "6"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "7"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "8"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "9"
                        }
                    },
                    {
                        "valueCoding": {
                            "code": "10"
                        }
                    }
                ]
            }
        ]
    }
}
