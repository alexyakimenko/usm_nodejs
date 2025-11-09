import 'dotenv/config'

interface Config {
    db: {
        user: string;
        password: string;
        name: string;
        port: number;
    },
    app: {
        port: number;
        title: string;
    },
    auth: {
        jwt: string;
    }
}

const config: Config = {
    db: {
        user: process.env.POSTGRES_USER!,
        password: process.env.POSTGRES_PASSWORD!,
        name: process.env.POSTGRES_DB!,
        port: Number(process.env.POSTGRES_PORT)
    },
    app: {
        port: Number(process.env.APP_PORT),
        title: process.env.APP_TITLE!,
    },
    auth: {
        jwt: process.env.JWT_SECRET!,
    }
}

export default config;
