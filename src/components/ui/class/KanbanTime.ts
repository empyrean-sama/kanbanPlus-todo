import { KanbanDateTime } from "../DateTimePicker";

export default class KanbanTime {
    private _hours:   number;
    private _minutes: number;
    private _days:   number;

    public static MAX_DAYS: number = 99;
    public static MAX_HOURS: number = 23;
    public static MAX_MINUTES: number = 59;

    /**
     * Utility method useful while trying to set state
     * @returns a new KanbanTime object with identical fields to this object
     */
    public clone(): KanbanTime {
        return new KanbanTime(this._days, this._hours, this._minutes);
    }

    /**
     * Constructor does nothing special other than initialize values
     */
    public constructor(days?: number, hours?: number, minutes?: number) {
        this._days = days || 0;
        this._hours = hours || 0;
        this._minutes = minutes || 0;
    }

    /**
     * Converts this object into a string to be stored on the file system 
     * @returns a string which can be written to the file system
     */
    public toString(): string {
        return `${this._days};${this._hours};${this._minutes}`;
    }

    /**
     * Converts a relevant string in memory into a usable KanbanTime object
     * @param timeStr: the string in memory
     * @throws an error if the string is not serializable
     */
    public fromString(timeStr: string): void {
        const fields = timeStr.split(';');

        //throw error early after preliminary check
        if(fields.length !== 3) {
            throw new Error(`Error trying to read a KanbanTime from the string ${timeStr}, expected 3 fields. Got only ${fields.length}`);
        }

        //setup the _days field
        this._days = parseInt(fields[0]);
        if(this._days && this._days < 0 && this._days > KanbanTime.MAX_DAYS) {
            throw new Error('Error trying to deserialize days from memory')
        } 

        //setup the _hours field
        this._hours = parseInt(fields[1]);
        if(this._hours && this._hours < 0 && this._hours > KanbanTime.MAX_HOURS) {
            throw new Error('Error trying to deserialize hours from memory')
        }

        //setup the _minutes field
        this._minutes = parseInt(fields[2]);
        if(this._minutes && this._minutes < 0 && this._minutes > KanbanTime.MAX_MINUTES) {
            throw new Error('Error trying to deserialize minutes from memory')
        } 
    }

    /**
     * A static utility for better syntactical usage of the fromString method
     * @param timeStr: the string in memory
     * @returns a new KanbanTime object
     */
    public static fromString(timeStr: string): KanbanTime {
        const dt = new KanbanTime();
        dt.fromString(timeStr);
        return dt;
    }

    /**
     * Serialize this object's guts as a time string
     * @param selectDays boolean if set will also show the number of days selected on the placeholder
     * @returns a string which is the description of the time stored inside
     */
    public serializeTime(selectDays?: boolean): string {
        let str = "";
        if(selectDays) {
            str = str + this._days.toString().padStart(2, '0') + " (days) : "; 
        }
        str = str + this._hours.toString().padStart(2, '0') + " (hrs) : ";
        str = str + this._minutes.toString().padStart(2, '0') + " (mins) ";
        return str;
    }

    /**
     * Get the _days field
     * @returns the _days field
     */
    public getDays(): number {
        return this._days;
    }
    /**
     * Set the _days field
     * @param days to set the _days field with
     * @throws an Error if the value trying to be set is greater than MAX_DAYS or less than 0
     * @returns this for chaining operations
     */
    public setDays(days: number): KanbanTime {
        if(days > KanbanTime.MAX_DAYS || days < 0) {
            throw new Error(`Trying to set the days field as ${days} which is not in the range 0 to ${KanbanTime.MAX_DAYS} (both inclusive)`);
        }
        this._days = days;
        return this;
    }
    /**
     * Try to increment the _days field by 1
     * @throws an Error if the field is crossing the value MAX_DAYS
     * @returns this for easy chaining of operations
     */
    public incrementDays(): KanbanTime {
        if(this._days + 1 > KanbanTime.MAX_DAYS) {
            throw new Error(`Trying to increment days above max days of ${KanbanTime.MAX_DAYS}`);
        }
        this._days++;
        return this;
    }
    

    /**
     * Get the _hours field
     * @returns the _hours field
     */
    public getHours(): number {
        return this._hours;
    }
    /**
     * Set the _hours field
     * @param hours to set the _hours field with
     * @throws an error if trying to set a value not in the range 0 - MAX_HOURS (both inclusive)
     * @returns this for chaining operations
     */
    public setHours(hours: number): KanbanTime {
        if(hours > KanbanTime.MAX_HOURS || hours < 0) {
            throw new Error(`${hours} not in the range 0 - ${KanbanTime.MAX_HOURS} (both inclusive)`);
        }
        this._hours = hours;
        return this;
    }
    /**
     * Try to increment the number of hours by one
     * @throws an error if the number of hours is going above MAX_HOURS 
     * @returns 'this' for easy chaining operations
     */
    public incrementHour(): KanbanTime {
        if(this._hours + 1 > KanbanTime.MAX_HOURS) {
            throw new Error(`Trying to increment hours above max hours which is ${KanbanTime.MAX_HOURS}`)
        }
        this._hours++;
        return this;
    }

    /**
     * Get the _minutes field
     * @returns the _minutes field
     */
    public getMinutes(): number {
        return this._minutes;
    }
    /**
     * Set the _minutes field
     * @param minutes to set the _minutes field
     * @throws an Error if minutes is greater than MAX_MINUTES or less than 0
     * @returns this for chaining operations
     */
    public setMinutes(minutes: number): KanbanTime {
        if(minutes > KanbanTime.MAX_MINUTES || minutes < 0) {
            throw new Error(`trying to set the _minutes field to ${minutes} which is not in the range 0-${KanbanTime.MAX_MINUTES} (both inclusive)`);
        }
        this._minutes = minutes;
        return this;
    }
    /**
     * Increase the _minutes field by 1
     * ? this method will automatically handle increment hour or day if required
     * @returns this to allow chaining operations
     */
    public incrementMinute(): KanbanTime {
        if(this._minutes + 1 > KanbanTime.MAX_MINUTES) {
            throw new Error(`trying to increment minutes to above MAX_MINUTES which is ${KanbanTime.MAX_MINUTES}`);
        }
        this._minutes++;
        return this;
    }
}