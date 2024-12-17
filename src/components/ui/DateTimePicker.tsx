import React, { createContext, useContext, useState } from "react";
import Style from "./DateTimePicker.module.scss";
import { Dropdown, DropdownItem } from "./Dropdown";
import { DateTime, DateTimeUnit, MonthNumbers } from "luxon";
import { FaAnglesRight, FaAngleRight, FaAnglesLeft, FaAngleLeft } from "react-icons/fa6";
import Button, { EButtonFace, EButtonSize } from "./Button";
import clone from "just-clone"

const MAX_DISPLAY_DATE_TIME_YEAR = 2040;
const MIN_DISPLAY_DATE_TIME_YEAR = 1940;

export interface IDateTimePickerProps {
    /** Every DateTimePicker must have a unique id */
    id: string,

    /** Time will not be selectable by default, this flag can be set to enable collecting time */
    selectTime?: boolean

    /** Set this flag to span full width */
    spanFullWidth?: boolean
}

function DateTimePlaceholder({date, time}: {date: string, time?: string}) {
    return (
        <span className={Style["DateTimePlaceholder"]}>
            <span className={Style["date"]}>{date}</span>
            {time ? <span className={Style["time"]}>{time}</span> : undefined}
        </span>
    )
}

class KanbanDateTime {

    private _day: number = 9;
    private _month: number;
    private _year: number;
    private _hour: number = 0;
    private _minute: number = 0;
    private _isAm: boolean | undefined = undefined;

    /**
     * Utility to construct a luxon DateTime object out of this object data
     * @returns the contents of this object as 24 hour DateTime luxon object
     */
    public getDateTime(): DateTime {
        return DateTime.local(this._year, this._month, this._day, this._hour + ((!this._isAm) ? 12 : 0), this._minute);
    }

    /**
     * Constructor does nothing special other than initialize values
     */
    public constructor(day?: number, month?: number, year?: number, hour?: number, minute?: number, isAm?: boolean) {
        this._day = day || Number.NaN;
        this._month = month || Number.NaN;
        this._year = year || Number.NaN;
        this._hour = hour || 0;
        this._minute = minute || 0;
        this._isAm = isAm || true;
    }

    /**
     * Utility to construct the Placeholder react node for display
     * @param includeTime: Include time also to be displayed inside the serialized structure
     */
    public serialize(includeTime: boolean): React.ReactNode {
        return <DateTimePlaceholder date={this.serializeDate()} time={includeTime ? this.serializeTime() : undefined} />
    }

    /**
     * Serialize this object's guts as a date string
     * @returns a string which is the description of the date stored inside
     */
    public serializeDate(): string {
        const dt = this.getDateTime();
        let str = "";
        if(dt.isValid) {
            str = `(${dt.weekdayLong}) ${this._day.toString().padStart(2, '0')} ${dt.monthShort?.toLocaleUpperCase()} ${dt.year}`;
        }
        else {
            str = "(------) -- --- ----";
        }
        return str;
    }

    /**
     * Serialize this object's guts as a time string
     * @returns a string which is the description of the time stored inside
     */
    public serializeTime(): string {
        const dt = this.getDateTime();
        let str = "";
        if(dt.isValid) {
            str = `${this._hour.toString().padStart(2, '0')}:${this._minute.toString().padStart(2, '0')} ${this._isAm? "AM" : "PM"}`;
        }
        else {
            str = "--:-- --";
        }
        return str;
    }

    /**
     * Utility to get the full month name 
     */
    public getMonthFullName(): string {
        const dt = this.getDateTime();
        return dt.monthLong || "";
    }

    /**
     * Get the year field
     * @returns the year field
     */
    public getYear(): number {
        return this._year;
    }

    /**
     * Get the month field
     * @returns the month field
     */
    public getMonth(): number {
        return this._month;
    }

    /**
     * Get the day field
     * @returns the day field
     */
    public getDay(): number {
        return this._day
    }

    /**
     * Get the hours field
     * @returns the hours field
     */
    public getHours(): number {
        return this._hour;
    }

    /**
     * Get the minutes field
     * @returns the minutes field
     */
    public getMinutes(): number {
        return this._minute;
    }

    /**
     * Get the isAm field
     * @returns the isAm field
     */
    public isAm(): boolean | undefined {
        return this._isAm;
    }
}

/**
 * Utility method to get the number of days in a month
 * @param month: Use 1 for January, 2 for February, etc.
 * @param year: full 4 digit year, this required to say check for leap year
 * @returns the number days in the month
 */
function daysInMonth (month: number, year: number): number { 
    return new Date(year, month, 0).getDate();
}

/**
 * Maps from year to map of month to where every date must go every month
 */
const memoizedDates: Map<number, Map<number, Array<{date: number, weekNumber: number, dayNumber: number}>>> = new Map();
/**
     * Utility method to calculate the date to fill in any given box inside the calendar
     * @param year: the returned date per grid cell depends on the year in question
     * @param month: the returned date per grid cell depends on the month in question
     * @param weekNumber: this is essentially the grid row number, starts from 1
     * @param dayNumber: this is essentially the grid column number, also starts from 1 (starts from 1 due luxon limitations)
     * @returns the date to be filled inside the given cell
     */
function getDate(year: number, month: number, weekNumber: number, dayNumber: number): number | undefined {
    // Try to find the entries from cache and if found compute from them 
    const memoizedEntries = memoizedDates.get(year)?.get(month);
    if(memoizedEntries) {
        return memoizedEntries.find((entry) => (entry.dayNumber === dayNumber && entry.weekNumber === weekNumber))?.date; 
    }

    // No entries were found, compute entries and cache them for the future before returning
    let entries: Array<{date: number, weekNumber: number, dayNumber: number}> = [];
    for(let i = 1; i <= daysInMonth(month, year); i++) {
        const dayNumber = DateTime.local(year, month, i).weekday;
        entries.push({
            date: i,
            weekNumber: Math.floor(((i - .1) / 7) + 1) + ((dayNumber < entries[0]?.dayNumber)? 1 : 0),
            dayNumber
        });
    }
    if(!memoizedDates.has(year)) {
        memoizedDates.set(year, new Map());
    }
    memoizedDates.get(year)?.set(month, entries);
    return entries.find((entry) => (entry.dayNumber === dayNumber && entry.weekNumber === weekNumber))?.date;
}

interface IDateTimePickerContext {
    /**
     * Gets the date currently selectedDate 
     * @returns an object containing the year, month and day selected or null if nothing is selected
     */
    getSelectedDate(): {year: number, month: number, date: number} | null,

    /**
     * Set the date to be selected by specifying the year, month and date
     * @param year: the year selected, must be 4 digits say like 2024
     * @param month: must be an integer in the range 1 -12, january is 1 not 0
     * @param date: the date inside the month
     * @throws an error if trying to select an invalid date
     */
    setSelectedDate(year: number, month: MonthNumbers, date: number): void,
    
    /**
     * Utility method to get the date that is currently being displayed by the calender
     * @returns a object containing the year and month which is currently being shown, month starts from the index 1
     */
    getDisplayDate(): {year: number, month: number}

    /**
     * Gets the unique id associated with every date tie picker, definitely useful for setting up keys or things of that nature  
     */
    getDateTimePickerId(): string
}
const DateTimePickerContext = createContext<IDateTimePickerContext | undefined>(undefined);

export default function DateTimePicker(props: IDateTimePickerProps) {
    
    const [dateTime, setDateTime] = useState(new KanbanDateTime());
    const [displayDateTime, setDisplayDateTime] = useState(DateTime.now());
    
    function handleNextMonthClicked(ev: React.MouseEvent<HTMLButtonElement>) {
        setDisplayDateTime((prevState) => prevState.plus({month: 1}));
    }

    function handlePreviousMonthClicked(ev: React.MouseEvent<HTMLButtonElement>) {
        setDisplayDateTime((prevState) => prevState.minus({month: 1}));
    }

    function handleNextYearClicked(ev: React.MouseEvent<HTMLButtonElement>) {
        setDisplayDateTime((prevState) => prevState.plus({years: 1}));
    }

    function handlePreviousYearClicked(ev: React.MouseEvent<HTMLButtonElement>) {
        setDisplayDateTime((prevState) => prevState.minus({years: 1}));
    }
    
    function handleDisableMonthForward(): boolean {
        return (displayDateTime.year > MAX_DISPLAY_DATE_TIME_YEAR && displayDateTime.month === 12)
    }

    function handleDisableMonthBackward(): boolean {
        return (displayDateTime.year < MIN_DISPLAY_DATE_TIME_YEAR && displayDateTime.month === 1)
    }
    
    function getSelectedDate(): {year: number, month: number, date: number} | null {
        if(dateTime.getYear() && dateTime.getMonth() && dateTime.getDay()) {
            return { year: dateTime.getYear(), month: dateTime.getMonth(), date: dateTime.getDay() };
        }
        else return null;
    }

    function setSelectedDate(year: number, month: MonthNumbers, date: number) {
        setDateTime((prevState) => {
            return new KanbanDateTime(date, month, year, prevState.getHours(), prevState.getMinutes(), prevState.isAm());
        });
    }

    function getDisplayDate(): {year: number, month: number} {
        return {year: displayDateTime.year, month: displayDateTime.month};
    }

    function getDateTimePickerId(): string {
        return props.id;
    }

    return (
        <Dropdown placeholder={dateTime.serialize(props.selectTime || false)} id={props.id} spanFullWidth={props.spanFullWidth} canContentSpanFullWidth={false}>
            <DateTimePickerContext.Provider value={{setSelectedDate, getSelectedDate, getDisplayDate, getDateTimePickerId}}>
                <DropdownItem id="month-selector" className={Style['month-year-selector']} selectable={false}>
                    <span className={Style["button-rack"]}>
                        <Button face={EButtonFace.link} isOutlined onClick={handlePreviousYearClicked} disabled={displayDateTime.year < 1941}><FaAnglesLeft /></Button>
                        <Button face={EButtonFace.link} isOutlined onClick={handlePreviousMonthClicked} disabled={handleDisableMonthBackward()}><FaAngleLeft /></Button>
                    </span>
                    <span className={Style["display-rack"]}>
                        <span>{displayDateTime.monthLong}</span>
                        <span>({displayDateTime.year})</span>
                    </span>
                    <span className={Style["button-rack"]}>
                        <Button face={EButtonFace.link} isOutlined onClick={handleNextMonthClicked} disabled={handleDisableMonthForward()}><FaAngleRight /></Button>
                        <Button face={EButtonFace.link} isOutlined onClick={handleNextYearClicked} disabled={displayDateTime.year > 2040}><FaAnglesRight /></Button>
                    </span>
                </DropdownItem>
                <DropdownItem id="day-selector" className={Style["day-selector"]} selectable={false}>
                    <span className={Style['day-row']}>
                        <span className={Style['day-box']}>Mon</span>
                        <span className={Style['day-box']}>Tue</span>
                        <span className={Style['day-box']}>Wed</span>
                        <span className={Style['day-box']}>Thu</span>
                        <span className={Style['day-box']}>Fri</span>
                        <span className={`${Style['color-danger']} ${Style['day-box']}`}>Sat</span>
                        <span className={`${Style['color-danger']} ${Style['day-box']}`}>Sun</span>
                    </span>
                    {[1,2,3,4,5,6].map((weekNumber: number) => <WeekEntry weekNumber={weekNumber} key={`${weekNumber} ${props.id} Week Entry`} />)}
                </DropdownItem>
            </DateTimePickerContext.Provider>
        </Dropdown>
    );
}

/**
 * Component representing every week row inside the calender
 * @prop weekNumber is the row number inside the calender component, starts with 1
 * @returns a React component
 */
function WeekEntry({weekNumber}: {weekNumber: number}) {
    const dateTimePickerContext = useContext(DateTimePickerContext) as IDateTimePickerContext;
    const id = dateTimePickerContext.getDateTimePickerId();
    return(
        <span className={`${Style["day-row"]}`}>
            {[1,2,3,4,5].map((dayNumber: number) => <DateEntry rowNumber={weekNumber} columnNumber={dayNumber} dateEntryColor={EDateEntryColor.normal} key={`${id} ${weekNumber} ${dayNumber} DateTimePicker Date Entry`} />)}
            {[6,7].map((dayNumber: number) => <DateEntry rowNumber={weekNumber} columnNumber={dayNumber} dateEntryColor={EDateEntryColor.weekend} key={`${id} ${weekNumber} ${dayNumber} DateTimePicker Date Entry`} />)}
        </span>
    );
}

enum EDateEntryColor {
    normal = "",
    weekend = Style["color-danger"]
}

interface IDateEntryProps {
    /** The row number is 1 indexed not 0 */
    rowNumber: number,

    /** The column number is also 1 indexed not zero */
    columnNumber: number,

    /** The color to display the entry in  */
    dateEntryColor: EDateEntryColor
}

function DateEntry({rowNumber, columnNumber, dateEntryColor}: IDateEntryProps) {
    const dateTimePickerContext = useContext(DateTimePickerContext) as IDateTimePickerContext;
    const displayDate = dateTimePickerContext.getDisplayDate();
    const selectedDate = dateTimePickerContext.getSelectedDate();

    console.log('selected date: ', selectedDate);

    function handleClick() {
        dateTimePickerContext.setSelectedDate(displayDate.year, displayDate.month as MonthNumbers, getDate(displayDate.year, displayDate.month, rowNumber, columnNumber) as number);
    }
    
    let reactNode: React.ReactNode | undefined;
    const dateEntry = getDate(displayDate.year, displayDate.month, rowNumber, columnNumber); 
    const isSelectedDate = dateEntry === selectedDate?.date && displayDate.month === selectedDate?.month && displayDate.year === selectedDate.year;
    if(dateEntry) {
        reactNode = <Button face={EButtonFace.none} className={`${Style['day-box']} ${dateEntryColor} ${isSelectedDate ? Style['selected'] : ''}`} onClick={handleClick}>
                        {dateEntry}
                    </Button>
    }
    else {
        reactNode = <span className={`${Style['day-box']}`}></span>
    }

    return reactNode;
}