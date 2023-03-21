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
            "path": "/app/monitor",
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
                        { "label": "id", "field": "_id" },
                        { "label": "event_time", "field": "event_time" },
                        // { "label": "event_time", "field": "event_time" },
                        // { "label": "event_time", "field": "event_time" },
                        // { "label": "event_time", "field": "event_time" },
                        // { "label": "event_time", "field": "event_time" },
                        // { "label": "event_time", "field": "event_time" }
                    ]
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
            "path": "/app/dashboard",
            "authenticated": true,
            "acl": [],
            "active": true,
            "options": {}
        },
        "History": {
            "id": "History",
            "localeId": "history",
            "path": "/app/history",
            "authenticated": true,
            "acl": [],
            "active": false,
            "options": {}
        },
        "User Management": {
            "id": "User Management",
            "localeId": "userManagement",
            "path": "/app/user-management",
            "authenticated": true,
            "acl": [],
            "active": false,
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
                { page: "User Management" },
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