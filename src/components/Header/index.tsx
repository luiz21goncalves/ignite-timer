import { Scroll, Timer } from 'phosphor-react'
import { NavLink } from 'react-router-dom'
import logoIgnite from '../../assets/logo-ignite.svg'

import * as S from './styles'

export function Header() {
  return (
    <S.HeaderContainter>
      <img src={logoIgnite} alt="" />

      <nav>
        <NavLink to="/" title="Cronômetro">
          <Timer size={24} />
        </NavLink>

        <NavLink to="/history" title="Histórico">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </S.HeaderContainter>
  )
}
