import Sentry from "@sentry/node"
import config from "@/config/config"

Sentry.init({
    dsn: config.app.sentry.dsn,
    sendDefaultPii: true,
    ignoreErrors: [
        "ValidationError"
    ]
})