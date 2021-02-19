import { DATE_FORMAT_MASKS } from '../../../utils/constants';

class DateFormat {

    private date: Date;
    private format: string;
    private dateValues: any;
    private dateToken: RegExp = /dd|mm|yyyy|MM|HH|s{2,3}/g;

    constructor(dateValue: string | number, format?: string) {
        this.format = format || DATE_FORMAT_MASKS.default;
        this.date = dateValue ? new Date(dateValue) : new Date();

        const day: number = this.date.getDate();
        const month: number = this.date.getMonth() + 1;
        const year: number = this.date.getFullYear();
        const hours: number = this.date.getHours();
        const minutes: number = this.date.getMinutes();
        const seconds: number = this.date.getSeconds();
        const milliseconds: number = this.date.getMilliseconds();

        this.dateValues = {
            dd: this._addLeadingZeros(day),
            mm: this._addLeadingZeros(month),
            yyyy: this._addLeadingZeros(year, 4),
            HH: this._addLeadingZeros(hours),
            MM: this._addLeadingZeros(minutes),
            ss: this._addLeadingZeros(seconds),
            sss: this._addLeadingZeros(milliseconds)
        };
    }

    public applyFormat(format?: string) {
        const dateFormat = DATE_FORMAT_MASKS[format] || format || this.format;

        return dateFormat.replace(this.dateToken, (match) => {
            if (match in this.dateValues) {
                return this.dateValues[match];
            }
            return match.slice(1, match.length - 1);
        });
    }

    /* ###################### INTERNAL METHODS ###################### */

    private _addLeadingZeros(value: number | string, len: number = 2): string {
        value = String(value);
        while (value.length < len) {
            value = '0' + value;
        }

        return value;
    }

}

export default DateFormat;