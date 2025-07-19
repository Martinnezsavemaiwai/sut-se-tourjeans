import { createContext, ReactNode, useContext, useState } from 'react';

interface DateContextProps {
    dateSelected: any,
    setDateSelected: (param: string) => void,
    dateSelectedFormat: any,
    setDateSelectedFormat: (param: string) => void,
    dateID: any,
    setDateID: (param: number) => void,
}

const DateContext = createContext<DateContextProps>({
    dateSelected: "",
    setDateSelected: () => {},
    dateSelectedFormat: "",
    setDateSelectedFormat: () => {},
    dateID: 1,
    setDateID: () => {},
});

export const DateProvider = ({ children }: { children: ReactNode }) => {
    const [dateSelected, setDateSelected] = useState<string>("")
    const [dateSelectedFormat, setDateSelectedFormat] = useState<string>("");
    const [dateID, setDateID] = useState<number | undefined>(undefined)

    return (
        <DateContext.Provider value={{ dateSelected, setDateSelected, dateSelectedFormat, setDateSelectedFormat, dateID, setDateID }}>
            {children}
        </DateContext.Provider>
    );
};

export const useDateContext = (): DateContextProps => {
    const context = useContext(DateContext);
    if (!context) {
        throw new Error("useDateContext must be used within a DateProvider");
    }
    return context;
};