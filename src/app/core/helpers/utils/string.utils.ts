export class StringUtils {

    static isEllipsisActivated(element: HTMLElement) {
        const tolerance = 2;
        return element.offsetWidth + tolerance < element.scrollWidth;
    }

    static replaceLineBrecksWithHTMLTag(text: string) {
        return text.replace(/\r?\n/g, '<br />');
    }

    static stripText(text: string, count: number, insertDots = true) {
        return text.slice(0, count) + (((text.length > count) && insertDots) ? '&hellip;' : '');
    }

    /**
     * Convert HTML-entites to text character
     */
    static decodeHtmlEntites(value: string) {
        return (value + '').replace(/&#\d+;/gm, (s) => {
            return String.fromCharCode(+s.match(/\d+/gm)[0]);
        });

    }

    /**
     * Convert HTML-text reserved character to entites
     */
    static endcodeHtmlEntites(value: string) {
        return value.replace(/./gm, (s) => {
            return '&#' + s.charCodeAt(0) + ';';
        });
    }

    static capitalizeFirstLetter(name: string) {
        return name.replace(/^\w/, c => c.toUpperCase());
    }

    static removeLastChar(name: string) {
        return name.substring(name.length - 1, 0);
    }

    /**
     * checks if the value is string or not if so it will return true if it has at least one char
     * NOTE: the value will be trimmed before the evaluation
     * @param value to be checked
     */
    public static isEmptyString(value: string): boolean {
        return typeof value !== 'string' || value.trim() === '';
    }

    /**
     * Checks if the givin value is url
     */
    static isUrl(value: string): boolean {
        try {
            return !!new URL(value);
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if the type is image
     *
     * @param type file mimetypes like jpg jpg jpeg png bmp gif
     */
    public static isImage(type: string) {
        return /(\.jpg|\.png|\.bmp|\.gif|\.jpeg)$/i.test(type);
    }

    /**
     * Check if the givin value is file type
     * File type includes the images
     */
    public static isFile(type: string) {
        return StringUtils.isImage(type) || StringUtils.isPdf(type);
    }

    /**
     * Check if the type is pdf type
     */
    public static isPdf(type: string) {
        return /(.pdf|application\/pdf)/.test(type);
    }

    static isUUID(value: string) {
        return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
    }

    static isHTML(value: any) {
        const doc = new DOMParser().parseFromString(value, 'text/html');
        return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
    }

    static replaceAll(text: string, value: string, replaceValue: string) {
        let newText = text;
        while (newText.includes(value)) {
            newText = newText.replace(value, replaceValue);
        }
        return newText;
    }

    static pascalCase(value: string) {
        return value?.split(' ').map(StringUtils.capitalizeFirstLetter).join('');
    }


    static strictText(text: string, count: number, insertDots = true) {
        return text.slice(0, count) + (((text.length > count) && insertDots) ? '&hellip;' : '');
    }
}
