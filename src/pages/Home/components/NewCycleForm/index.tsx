import { useFormContext } from 'react-hook-form'

import { useCycles } from '../../../../contexts/CyclesContext'

import * as S from './styles'

export function NewCycleForm() {
  const { activeCycle } = useCycles()
  const { register } = useFormContext()

  return (
    <S.FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <S.TaskInput
        id="task"
        type="text"
        placeholder="Dê um nome para seu projeto"
        list="task-suggestions"
        disabled={Boolean(activeCycle)}
        {...register('task')}
      />

      <datalist id="task-suggestions">
        <option value="Banana" />
        <option value="Nanica" />
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <S.MinutesAmountInput
        id="minutesAmount"
        type="number"
        placeholder="00"
        step={5}
        min={5}
        max={60}
        disabled={Boolean(activeCycle)}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </S.FormContainer>
  )
}
