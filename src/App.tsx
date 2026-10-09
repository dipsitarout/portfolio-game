import { useGameStore } from './store/gameStore'
import { StartScreen } from './components/StartScreen'
import { LoadingScreen } from './components/LoadingScreen'
import { Game } from './components/Game'
import { GameUI } from './components/GameUI'
import { PauseMenu } from './components/PauseMenu'

export default function App() {
  const phase = useGameStore((s) => s.phase)
  const inGame = phase === 'playing' || phase === 'paused'
  return (
    <>
      {phase !== 'menu' && <Game />}
      {phase === 'menu' && <StartScreen />}
      {phase === 'loading' && <LoadingScreen />}
      {inGame && <GameUI />}
      {phase === 'paused' && <PauseMenu />}
    </>
  )
}
