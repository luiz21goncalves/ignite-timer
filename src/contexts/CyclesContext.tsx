import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type CreateCycleData = {
  task: string
  minutesAmount: number
}

type Cycle = {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

type CyclesContextData = {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | undefined
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

function CyclesContextProvider(props: CyclesContextProviderProps) {
  const { children } = props

  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | undefined>(
    undefined,
  )
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = useMemo(
    () => cycles.find((findCycle) => findCycle.id === activeCycleId),
    [activeCycleId, cycles],
  )

  const markCurrentCycleAsFinished = useCallback(() => {
    setCycles((prevState) =>
      prevState.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        }

        return cycle
      }),
    )

    setActiveCycleId(undefined)
  }, [activeCycleId])

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

    setCycles((prevState) => [...prevState, newCycle])
    setActiveCycleId(id)
    setSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    setCycles((prevState) =>
      prevState.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        }

        return cycle
      }),
    )

    setActiveCycleId(undefined)
  }

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
