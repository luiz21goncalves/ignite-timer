import differenceInSeconds from 'date-fns/differenceInSeconds'
import { useEffect } from 'react'
import { useCycles } from '../../../../contexts/CyclesContext'

import * as S from './styles'

export function Countdown() {
  const {
    activeCycle,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useCycles()

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const formatedMinutes = String(minutesAmount).padStart(2, '0')
  const formatedSeconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${formatedMinutes}:${formatedSeconds} - ${activeCycle.task}`
    } else {
      document.title = 'Ignite Timer'
    }
  }, [formatedMinutes, formatedSeconds, activeCycle])

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()

          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, markCurrentCycleAsFinished, setSecondsPassed])

  return (
    <S.CountdownContainer>
      <span>{formatedMinutes[0]}</span>
      <span>{formatedMinutes[1]}</span>
      <S.Separator>:</S.Separator>
      <span>{formatedSeconds[0]}</span>
      <span>{formatedSeconds[1]}</span>
    </S.CountdownContainer>
  )
}
