import { useEffect, useState } from "react"
import "./Calendar.css"
import { useDateContext } from "../../contexts/DateContext";

function Calendar(props: { schedules: any; }) {

    const { setDateSelected, dateSelectedFormat, setDateSelectedFormat, setDateID } = useDateContext()

    const { schedules } = props
    const [currentDate, setCurrentDate] = useState(new Date())

    const [dateS, setDateS] = useState("")
    const [dateSFM, setDateSFM] = useState("")
    const [scheID, setScheID] = useState(undefined)

    const [canGoToPrevMonth, setCanGoToPrevMonth] = useState(true)

    function handleSetDate(isAvailable: boolean, dateStrFormat: string, dateStr: string) {
        if (isAvailable) {
            setDateSFM(dateStrFormat);
            setDateS(dateStr);
            schedules.map((scd: any) => {
                const startDate = scd.StartDate.slice(0, 10)
                if (startDate === dateStr) {
                    setScheID(scd.ID)
                }
            })
        }
    }

    function checkAvailableDatesInMonth(isCancelled: boolean) {
        let tempDate = new Date(currentDate)
        let monthChangeCount = 0
        const maxMonthChange = 12
        const today = new Date()

        while (monthChangeCount < maxMonthChange) {
            const startOfMonth = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1)
            const endOfMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0)

            const hasAvailableDates = dateTime.some(([startDate]) => {
                const date = new Date(startDate)
                if (date < today) {
                    return false
                }
                return date >= startOfMonth && date <= endOfMonth
            })

            if (monthChangeCount === 1 && !hasAvailableDates) {
                setCanGoToPrevMonth(false)
            } else {
                setCanGoToPrevMonth(true)
            }

            if (hasAvailableDates) {
                if (!isCancelled && tempDate.getTime() !== currentDate.getTime()) {
                    setCurrentDate(tempDate)
                }
                return
            }

            tempDate.setMonth(tempDate.getMonth() + 1)
            tempDate.setDate(1)
            monthChangeCount++
        }
    }

    let dateTime: string[][] = [];
    let availableDates: string[] = []
    schedules?.forEach((schedule: any, index: number) => {
        if (!dateTime[index]) {
            dateTime[index] = []
        }
        if (schedule.StartDate && schedule.EndDate) {
            dateTime[index].push(schedule.StartDate.slice(0, 10))
            dateTime[index].push(schedule.EndDate.slice(0, 10))
            dateTime[index].push(schedule.TourScheduleStatus.StatusName)
            dateTime[index].push(schedule.AvailableSlots)
            availableDates.push(schedule.StartDate.slice(0, 10))
        }
    })

    function changeMonth(offset: number) {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset))
        setCurrentDate(newDate)

        if (offset === -1) {
            const prevMonthDate = new Date(newDate)
            prevMonthDate.setMonth(prevMonthDate.getMonth() - 1)
            checkAvailableDatesInMonth(false)
        }
    }

    function getCalendarDays() {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        const daysInMonth = endOfMonth.getDate()
        const startDayOfWeek = startOfMonth.getDay()

        const weeks: JSX.Element[][] = []
        let daysArray: JSX.Element[] = []

        for (let i = 0; i < startDayOfWeek; i++) {
            daysArray.push(<td key={`empty-${i}`}></td>)
        }

        var status = 0
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

            const today = new Date()
            const isPastDate = new Date(dateStr) < today

            let isAvailable = false
            let index = -1
            for (let i = 0; i < dateTime.length; i++) {
                isAvailable = dateTime[i]?.[0] === dateStr ? true : false

                if (isAvailable && dateTime[i]?.[2] === "ยังไม่เต็ม" && !isPastDate) {
                    index = i
                    status += 1
                    break
                }
                if (isAvailable && !isPastDate) {
                    index = i
                    break
                }
            }

            const endTime = dateTime[index]?.[1].slice(8, 10);
            const endTimeFormat = endTime?.startsWith("0") ? endTime?.slice(1, 2) : endTime

            const startMonth = dateTime[index]?.[0].slice(5,7)
            const endMonth = dateTime[index]?.[1].slice(5,7)
            const startMonthF = startMonth?.startsWith("0") ? startMonth?.slice(1, 2) : startMonth
            const endMonthF = endMonth?.startsWith("0") ? endMonth?.slice(1, 2) : endMonth

            const scheduleStatus = dateTime[index]?.[2]
            const availableSlots = dateTime[index]?.[3]

            const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

            const dateStrFormat = Number(endMonthF) - Number(startMonthF) === 0 ? (
                `วันที่ ${dateObj.getDate()} - ${endTimeFormat} ${months[dateObj.getMonth()]} ${dateObj.getFullYear() + 543} | ว่างจำนวน ${availableSlots} ที่นั่ง`
            ) : (
                `วันที่ ${dateObj.getDate()} ${months[dateObj.getMonth()]} - ${endTimeFormat} ${months[dateObj.getMonth()+1]} ${dateObj.getFullYear() + 543} | ว่างจำนวน ${availableSlots} ที่นั่ง`
            )
                

            if (isAvailable && status == 1 && dateSelectedFormat == "" && dateS == "" && scheduleStatus == "ยังไม่เต็ม") {
                setDateSFM(dateStrFormat);
                setDateS(dateStr);

                schedules.map((scd: any) => {
                    const startDate = scd.StartDate.slice(0, 10)
                    if (startDate === dateStr) {
                        setScheID(scd.ID)
                    }
                })
                status += 1

            }

            daysArray.push(
                <td key={day}>
                    <button
                        className={`calendar-day ${isAvailable ? (scheduleStatus === "เต็ม" ? "full" : "available") : ''} ${dateS === dateStr ? 'selected' : ""}`}
                        onClick={() => handleSetDate(isAvailable, dateStrFormat, dateStr)}
                        disabled={scheduleStatus === "เต็ม" ? true : false}
                    >{scheduleStatus === "เต็ม" ? "เต็ม" : day}</button>
                </td>
            );

            if ((daysArray.length) % 7 === 0 || day === daysInMonth) {
                weeks.push([...daysArray]);
                daysArray = [];
            }
        }
        return weeks.map((week, index) => <tr key={`week-${index}`}>{week}</tr>);
    };

    useEffect(() => {
        setDateSelected(dateS)
        setDateSelectedFormat(dateSFM)
        setDateID(Number(scheID))
    }, [dateSFM])

    useEffect(() => {
        let isCancelled = false;
        checkAvailableDatesInMonth(isCancelled);
        return () => {
            isCancelled = true;
        };
    }, [currentDate, dateTime]);

    const dayOfWeeks = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"]
    const months = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button className="prev-btn btn"
                    onClick={() => changeMonth(-1)}
                    disabled={!canGoToPrevMonth}
                >«</button>
                <span>
                    {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear() + 543}
                </span>
                <button className="next-btn btn" onClick={() => changeMonth(1)}>»</button>
            </div>
            <div className="date-box">
                <table className="calendar-table">
                    <thead>
                        <tr>
                            {dayOfWeeks.map((day, index) => <th key={index}>{day}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {getCalendarDays()}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
export default Calendar