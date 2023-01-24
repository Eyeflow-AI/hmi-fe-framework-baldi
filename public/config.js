const config = {
    "ws_url": "http://localhost:6040",
    "pages": {
        "Login": {
            "id": "Login",
            "localeId": "login",
            "path": "/login",
            "acl": [],
            "active": true,
            "options": {}
        },
        "Monitor": {
            "id": "Monitor",
            "localeId": "monitor",
            "path": "/app/monitor",
            "acl": [],
            "active": true,
            "options": {}
        },
        "Dashboard": {
            "id": "Dashboard",
            "localeId": "dashboard",
            "path": "/app/dashboard",
            "acl": [],
            "active": true,
            "options": {}
        }
    },
    "components": {
        "AppBar": {
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
    }
};

Object.freeze(config);

window.app_config = config;