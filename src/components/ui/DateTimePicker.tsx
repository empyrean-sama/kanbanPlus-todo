import React, { createContext, useContext, useState } from "react";
import Style from "./DateTimePicker.module.scss";
import { Dropdown, DropdownDivider, DropdownItem } from "./Dropdown";
import { DateTime, DateTimeUnit, MonthNumbers } from "luxon";
import { FaAnglesRight, FaAngleRight, FaAnglesLeft, FaAngleLeft } from "react-icons/fa6";
import Button, { EButtonFace, EButtonSize } from "./Button";
import clone from "just-clone"

import { FaAngleUp, FaAngleDown } from "react-icons/fa6";

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

    private _day:    number;
    private _month:  number;
    private _year:   number;
    private _hour:   number;
    private _minute: number;
    private _isAm:   boolean;

    /**
     * Utility method useful while trying to set state
     * @returns a new KanbanDateTime object with identical fields to this object
     */
    public clone(): KanbanDateTime {
        return new KanbanDateTime(this.getDay(), this.getMonth(), this.getYear(), this.getHour(), this.getMinute(), this.getIsAm());
    }

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
        this._isAm = (isAm === null || isAm === undefined)? true : isAm;
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
     * Set the year field
     * @param year to set the year field with
     * @returns this for easy chaining operations
     */
    public setYear(year: number): KanbanDateTime {
        this._year = year;
        return this;
    }


    /**
     * Get the month field
     * @returns the month field
     */
    public getMonth(): number {
        return this._month;
    }
    /**
     * Set the month field
     * @param month to set the month field with
     * @returns this for easy chaining operations
     */
    public setMonth(month: number): KanbanDateTime {
        this._month = month;
        return this;
    }

    /**
     * Get the day field
     * @returns the day field
     */
    public getDay(): number {
        return this._day
    }
    /**
     * Set the day field
     * @param day to set the day field with
     * @returns this for easy chaining operations
     */
    public setDay(day: number): KanbanDateTime {
        this._day = day;
        return this;
    }

    /**
     * Get the hour field
     * @returns the hour field
     */
    public getHour(): number {
        return this._hour;
    }
    /**
     * Set the hour field
     * @param calculateHour is a simple function that will allow the user to set the hour based on what is already inside the class
     * @returns this for easy chaining operations
     */
    public setHour(calculateHour: (currentHour: number) => number): KanbanDateTime {
        this._hour = calculateHour(this._hour);
        return this;
    }
    
    /**
     * Get the minutes field
     * @returns the minutes field
     */
    public getMinute(): number {
        return this._minute;
    }
    /**
     * Set the minute field
     * @param calculateMinute is a simple function that will allow the user to set the minute based on what is already inside the class
     * @returns this for easy chaining operations
     */
    public setMinute(calculateMinute: (currentMinute: number) => number): KanbanDateTime {
        this._minute = calculateMinute(this._minute);
        return this;
    }

    /**
     * Get the isAm field
     * @returns the isAm field
     */
    public getIsAm(): boolean {
        return this._isAm;
    }
    /**
     * Set the isAm field
     * @param isAm to set the isAm field with
     * @returns this for easy chaining operations
     */
    public setIsAm(isAm: boolean): KanbanDateTime {
        this._isAm = isAm;
        return this;
    }
    /**
     * Toggle the isAm field
     * @returns this for easy chaining operations
     */
    public toggleIsAm(): KanbanDateTime {
        this._isAm = !(this._isAm);
        return this;
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

    function handleHourIncrease() {
        setDateTime((prevState) => prevState.clone().setHour((currentHour: number) => (currentHour + 1) % 13));
    }

    function handleHourDecrease() {
        setDateTime((prevState) => prevState.clone().setHour((currentHour: number) => Math.max((currentHour - 1) % 13, 0)));
    }

    function handleMinuteIncrease() {
        setDateTime((prevState) => prevState.clone().setMinute((currentMinute: number) => (currentMinute + 1) % 60));
    }

    function handleMinuteDecrease() {
        setDateTime((prevState) => prevState.clone().setMinute((currentMinute: number) => Math.max((currentMinute - 1) % 60, 0)));
    }

    function handleMeridiemChange() {
        setDateTime((prevState) => {
            const isAm = prevState.getIsAm();
            return prevState.clone().setIsAm(!isAm);
        });
    }

    function handleSelectToday() {
        const dt = DateTime.now();
        const isAm = dt.hour < 12
        setDateTime(new KanbanDateTime(dt.day, dt.month, dt.year, isAm ? dt.hour : dt.hour - 12, dt.minute, isAm))
    }

    function handleClearDate() {
        setDateTime(new KanbanDateTime())
    }
    
    function getSelectedDate(): {year: number, month: number, date: number} | null {
        if(dateTime.getYear() && dateTime.getMonth() && dateTime.getDay()) {
            return { year: dateTime.getYear(), month: dateTime.getMonth(), date: dateTime.getDay() };
        }
        else return null;
    }

    function setSelectedDate(year: number, month: MonthNumbers, date: number) {
        setDateTime((prevState) => prevState.clone().setDay(date).setMonth(month).setYear(year));
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
                <DropdownDivider />
                <DropdownItem id="time-and-functions-selector" className={`${Style["row"]} ${Style["spacing-02"]}`} selectable={false}>
                    {props.selectTime ? <div id="time-selector" className={`${Style["row"]} ${Style["center-align"]}`}>
                        <div className={`${Style["hour-selector"]} ${Style["column"]}`}>
                            <Button face={EButtonFace.none} onClick={handleHourIncrease}><FaAngleUp /></Button>
                            {dateTime.getHour().toString().padStart(2,'0')}
                            <Button face={EButtonFace.none} onClick={handleHourDecrease}><FaAngleDown /></Button>
                        </div>
                        <span className={`${Style["hour-minute-separator"]}`}>:</span>
                        <div className={`${Style["minute-selector"]} ${Style["column"]}`}>
                            <Button face={EButtonFace.none} onClick={handleMinuteIncrease}><FaAngleUp /></Button>
                            {dateTime.getMinute().toString().padStart(2,'0')}
                            <Button face={EButtonFace.none} onClick={handleMinuteDecrease}><FaAngleDown /></Button>
                        </div>
                        <div className={`${Style["am-pm-selector"]} ${Style["column"]}`}>
                            <Button face={EButtonFace.none} onClick={handleMeridiemChange}><FaAngleUp /></Button>
                            {dateTime.getIsAm() ? <span className={`${Style["am-pm-text"]}`}>AM</span> : <span className={`${Style["am-pm-text"]}`}>PM</span>}
                            <Button face={EButtonFace.none} onClick={handleMeridiemChange}><FaAngleDown /></Button>
                        </div>
                    </div> : undefined}
                    <div id="time-selector-functions" className={`${Style["row"]} ${Style["spacing-01"]} ${Style["time-selector-functions"]}`}>
                        <Button face={EButtonFace.link} onClick={handleSelectToday}>Today</Button>
                        <Button face={EButtonFace.danger} onClick={handleClearDate}>Clear</Button>
                    </div>
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