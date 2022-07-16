import differenceInSeconds from 'date-fns/differenceInSeconds'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'

import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'

type CreateCycleData = {
  task: string
  minutesAmount: number
}

type CyclesContextData = {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  interruptCurrentCycle: () => void
  createNewCycle: (data: CreateCycleData) => void
}

type CyclesContextProviderProps = {
  children: ReactNode
}

const CyclesContext = createContext({} as CyclesContextData)

const CYCLES_STATE_STORAGE_KEY = '@IgniteTimer:cycles-state-1.0.0'

function CyclesContextProvider(props: CyclesContextProviderProps) {
  const { children } = props

  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      activeCycleId: null,
      cycles: [],
    },
    () => {
      const storedState = localStorage.getItem(CYCLES_STATE_STORAGE_KEY)

      if (storedState) {
        return JSON.parse(storedState)
      }
    },
  )

  const { activeCycleId, cycles } = cyclesState

  const activeCycle = useMemo(
    () => cycles.find((findCycle) => findCycle.id === activeCycleId),
    [activeCycleId, cycles],
  )

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  useEffect(() => {
    const cyclesStateString = JSON.stringify(cyclesState)

    localStorage.setItem(CYCLES_STATE_STORAGE_KEY, cyclesStateString)
  }, [cyclesState])

  const markCurrentCycleAsFinished = () =>
    dispatch(markCurrentCycleAsFinishedAction())

  const setSecondsPassed = useCallback((seconds: number) => {
    setAmountSecondsPassed(seconds)
  }, [])

  function createNewCycle({ task, minutesAmount }: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task,
      minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    setSecondsPassed(0)
  }

  const interruptCurrentCycle = () => dispatch(interruptCurrentCycleAction())

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

const useCycles = () => useContext(CyclesContext)

export { useCycles, CyclesContextProvider }
