import { $playerState } from '@/store/player'
import { getSource } from '@/utils/sources'
import { getEpisodeUrl } from '@/utils/url'
import { useStore } from '@nanostores/react'
import { navigate } from 'astro:transitions/client'
import { SkipBackIcon, SkipForwardIcon } from 'lucide-react'

interface NextPrevButtonsProps {
  season: number
  mediaId: number
  mediaTitle: string
  firstEpisode: number
  lastEpisode: number
  totalSeasons: number
  initialEpisode: number
}

export function NextPrevButtons({
  season,
  mediaId,
  mediaTitle,
  firstEpisode,
  lastEpisode,
  totalSeasons,
  initialEpisode,
}: NextPrevButtonsProps) {
  const playerState = useStore($playerState)
  const episode = playerState.episode ?? initialEpisode

  const isFirstEpisode = episode <= firstEpisode
  const isLastEpisode = episode >= lastEpisode
  const isLastSeason = season >= totalSeasons

  const handleEpisodeClick = (episode: number) => {
    $playerState.set({ ...$playerState.get(), episode })
    const searchParams = new URL(window.location.href).searchParams
    const source = getSource(searchParams.get('source'))
    window.history.replaceState(
      {},
      '',
      new URL(
        getEpisodeUrl(mediaId, mediaTitle, season, episode, source.id),
        window.location.href
      ).toString()
    )
  }

  const handleNextSeason = () => {
    const searchParams = new URL(window.location.href).searchParams
    const source = getSource(searchParams.get('source'))
    const newSeason = season + 1
    void navigate(getEpisodeUrl(mediaId, mediaTitle, newSeason, 1, source.id))
  }

  return (
    <div className='flex w-full items-center justify-end gap-2 rounded-2xl bg-white/10 p-2'>
      {!isFirstEpisode && (
        <button
          onClick={() => handleEpisodeClick(episode - 1)}
          className='group flex items-center justify-center gap-1 rounded-2xl bg-black/50 px-4 py-2 text-lg text-white transition-colors duration-200 active:bg-black/70 active:ring-2 active:ring-primary-500/80 active:ring-offset-0'
        >
          <SkipBackIcon className='size-5 text-white transition-transform duration-200 group-hover:-translate-x-1 group-active:-translate-x-2' />
          Prev
        </button>
      )}
      {!isLastEpisode && (
        <button
          onClick={() => handleEpisodeClick(episode + 1)}
          className='group flex items-center justify-center gap-1 rounded-2xl bg-black/50 px-4 py-2 text-lg text-white active:bg-black/70 active:ring-2 active:ring-primary-500/80 active:ring-offset-0'
        >
          Next
          <SkipForwardIcon className='size-5 text-white transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-2' />
        </button>
      )}
      {isLastEpisode && !isLastSeason && (
        <button
          onClick={handleNextSeason}
          className='group flex items-center justify-center gap-1 rounded-2xl bg-black/50 px-4 py-2 text-lg text-white active:bg-black/70 active:ring-2 active:ring-primary-500/80 active:ring-offset-0'
        >
          Next Season
          <SkipForwardIcon className='size-5 text-white transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-2' />
        </button>
      )}
    </div>
  )
}
