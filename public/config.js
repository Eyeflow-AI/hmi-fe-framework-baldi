const config = {
    "ws_url": "http://localhost:6030",
    "pages": {
        "Login": {
            "id": "Login",
            "localeId": "login",
            "path": "/login",
            "authenticated": false,
            "acl": [],
            "active": true,
            "options": {}
        },
        "Monitor": {
            "id": "MonitorBatch",
            "localeId": "monitor",
            "path": "/app/:stationSlugLabel/monitor",
            "authenticated": true,
            "acl": [],
            "active": true,
            "components": {
                "EventMenuBox": {
                    "itemHeight": 160,
                    "dateField": "startTime",
                },
                "EventHeader": {
                    "height": 80,
                    "fields": [
                        { "label": "_id", "field": "_id" },
                        { "label": "id", "field": "id" },
                        { "label": "start_time", "field": "startTime", "type": "date" },
                        { "label": "end_time", "field": "endTime", "type": "date" },
                        { "label": "station", "field": "station" },
                        // { "label": "event_time", "field": "event_time" }
                    ]
                },
                "EventBatchDataBox": {
                    "height": "100%",
                    "width": "100%",
                    "components": {
                        "GraphBox": {
                            // "width": 250,
                            "width": "100%",
                            "height": "100%"
                        },
                        "DataBox": {
                            "width": "calc(100vw - 496px)",
                            "height": "100%",
                            "active": false,
                        }
                    }
                }
            },
            "options": {
                "eventMenuWidth": 220,
                "getEventSleepTime": 30000
            }
        },
        "Dashboard": {
            "id": "Dashboard",
            "localeId": "dashboard",
            "path": "/app/:stationSlugLabel/dashboard",
            "authenticated": true,
            "acl": [],
            "active": true,
            "options": {}
        },
        "History": {
            "id": "History",
            "localeId": "history",
            "path": "/app/:stationSlugLabel/history",
            "authenticated": true,
            "acl": [],
            "active": true,
            "options": {}
        },
        "Management": {
            "id": "Management",
            "localeId": "management",
            "path": "/app/:stationSlugLabel/management",
            "authenticated": true,
            "acl": [],
            "active": true,
            "options": {}
        },
        "Tools": {
            "id": "Tools",
            "localeId": "tools",
            "path": "/app/tools",
            "authenticated": true,
            "acl": [],
            "active": true,
            "options": {}
        }
    },
    "components": {
        "AppBar": {
            "height": 64,
            "tabList": [
                { page: "Monitor" },
                { page: "Dashboard" },
                { page: "History" },
                { page: "Management" },
                { page: "Tools" },
            ]
        },
        "FilterBar": {
            "height": 80,
        }
    },
    "locale": {
        "default": "en",
        "languageList": [
            {
                "id": "en",
                "label": "English",
                "active": true
            },
            {
                "id": "pt",
                "label": "Português",
                "active": true
            }
        ]
    },
    "style": {
        "box": {
            "borderRadius": 1,
            "boxShadow": 2,
        }
    }
};

Object.freeze(config);

window.app_config = config;