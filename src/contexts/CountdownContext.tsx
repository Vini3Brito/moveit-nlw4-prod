import { 
    createContext, 
    ReactNode, 
    useContext, 
    useEffect, 
    useState } from "react";
import { ChallengesContext } from "./ChallengesContext";


interface CountdownContextData {
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
}

interface CountdownProviderProps {
    children: ReactNode
}

export const CountdownContext = createContext({} as CountdownContextData)

let countdownTimeout: NodeJS.Timeout

export function CountdownProvider ({ children }: CountdownProviderProps) {
    
    const {startNewChallenge} = useContext(ChallengesContext)

    const cicleTime = 25 * 60 //Value in seconds

    const [time, setTime] = useState(cicleTime)
    const [isActive, setIsActive] = useState(false)
    const [hasFinished, setHasFinished] = useState(false)
    
    const minutes = Math.floor(time / 60)
    const seconds = time % 60

    const startCountdown = () => {
        setIsActive(true)
    }

    const resetCountdown = () => {
        clearTimeout(countdownTimeout)
        setIsActive(false)
        setTime(cicleTime)
        setHasFinished(false)
    }

    useEffect(() => {
        if(isActive && time > 0){
            countdownTimeout = setTimeout(() => {
                setTime(time - 1)
            }, 1000)
        } else if(isActive && time === 0) {
            setHasFinished(true)
            setIsActive(false)
            startNewChallenge()
        }
    }, [isActive, time])

    return (
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountdown,
            resetCountdown,
        }}>
            {children}
        </CountdownContext.Provider>
    )
}