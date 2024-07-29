import configs from "./configs";

const env = (process.env.NODE_ENV || "development") as keyof typeof configs;
export const config = configs[env];
