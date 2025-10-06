import 'dotenv/config'

interface Config {
    server: {
        port: number,
    },
    app: {
        name: string,
    }
}

const config: Config = {
    server: {
        port: Number(process.env.PORT) ?? 3000
    },
    app: {
        name: process.env.APP_NAME ?? ""
    }
}

export default config