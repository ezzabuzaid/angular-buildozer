export class DateUtils {

    static duration(minutes: number) {
        const date = new Date();
        date.setMinutes(date.getMinutes() + minutes);
        return date.getTime();
    }

    /**
     * Convert numeric days to seconds
     */
    static daysToSeconds(days: number) {
        const d = new Date();
        const a = new Date();
        a.setDate(a.getDate() + days);
        return a.getTime() - d.getTime();
    }

    /**
     * Convert minutes to seconds
     */
    static minutesToSeconds(minutes: number) {
        const d = new Date();
        const a = new Date();
        a.setMinutes(a.getMinutes() + minutes);
        return a.getTime() - d.getTime();
    }

    /**
     * Check if the specicifed date elapsed the {maxAge}
     *
     * If max age not provided the current date will be used instead
     *
     * @param date the date to check
     * @param maxAge default to current date
     */
    static dateElapsed(date: number) {
        return date < Date.now();
    }
}