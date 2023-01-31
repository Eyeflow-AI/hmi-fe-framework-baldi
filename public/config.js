const config = {
    "ws_url": "http://localhost:6040",
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
            "id": "Monitor1",
            "localeId": "monitor",
            "path": "/app/monitor",
            "authenticated": true,
            "acl": [],
            "active": true,
            "components": {
                "EventMenuBox": {
                    "itemHeight": 160
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
        }
    },
    "components": {
        "AppBar": {
            "height": 64,
            "tabList": [
                {page:"Monitor"},
                {page:"Dashboard"},
            ]
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