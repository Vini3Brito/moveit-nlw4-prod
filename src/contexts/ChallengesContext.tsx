import { createContext, ReactNode, useEffect, useState } from "react";
import challenges from '../../challenges.json'
import Cookies from 'js-cookie'
import { LevelUpModal } from "../components/LevelUpModal";

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    experienceToNextLevel: number;
    challengesCompleted: number;
    activeChallenge: Challenge;
    levelUp: () => void;
    closeLevelUpModal: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
}

interface ChallengesProviderProps {
    children: ReactNode;
    level: number,
    currentExperience: number,
    challengesCompleted: number,
}

export const ChallengesContext = createContext({} as ChallengesContextData)

export function ChallengesProvider ({
        children, 
        ...rest
    }: ChallengesProviderProps) {

// Propriedades retornando valores iniciais (level = 1, exp = 0, challenges = 0)
    // const [level, setLevel] = useState(1)
    // const [currentExperience, setCurrentExperience] = useState(0)
    // const [challengesCompleted, setChallengesCompleted] = useState(0)

// Propriedades buscando os valores de cookies ou retornando iniciais
    const [level, setLevel] = useState(rest.level ?? 1)
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0)
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0)

    const [activeChallenge, setActiveChallenge] = useState(null)
    const [isLevelModalOpen, setIsLevelModalOpen] = useState(false)
    
    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    useEffect(() => {
        Notification.requestPermission()
    }, [])

    useEffect(() => {
        Cookies.set('level', level.toString())
        Cookies.set('currentExperience', currentExperience.toString())
        Cookies.set('challengesCompleted', challengesCompleted.toString())
    }, [level, currentExperience, challengesCompleted])

    const levelUp = () => {
      setLevel(level+1)
      setIsLevelModalOpen(true)
    }

    const closeLevelUpModal = () => {
        setIsLevelModalOpen(false)
    }

    const startNewChallenge = () => {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex]

        setActiveChallenge(challenge)

        new Audio('/notification.mp3').play()

        if (Notification.permission === 'granted') {
            new Notification('Novo desafio ', {
                body: `Valendo ${challenge.amount} xp!`,
            })
        }
    }
    
    const resetChallenge = () => {
        setActiveChallenge(null)
    }

    const completeChallenge = () => {
        if(!activeChallenge){
            return;
        }

        const { amount } = activeChallenge

        let finalExperience = currentExperience + amount

        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel
            levelUp()
        }

        setCurrentExperience(finalExperience)
        setActiveChallenge(null)
        setChallengesCompleted(challengesCompleted + 1)
    }

    return (
        <ChallengesContext.Provider value={{ 
                level,
                levelUp,
                currentExperience,
                experienceToNextLevel,
                challengesCompleted,
                activeChallenge,
                startNewChallenge,
                resetChallenge,
                completeChallenge,
                closeLevelUpModal,
            }}
        >
            {children}
            { isLevelModalOpen && <LevelUpModal /> }
        </ChallengesContext.Provider>
    )
}