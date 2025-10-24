import dayjs from 'dayjs';


export const logger = {
    isStdioMode: false,
    info: (...args: any[]) => {
        if (logger.isStdioMode) {
            console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] INFO `, ...args);
        } else {
            console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] INFO `, ...args);
        }
    },
    error: (...args: any[]) => {
        console.error(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] ERROR `, ...args);
    }
}