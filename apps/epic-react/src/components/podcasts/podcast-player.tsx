import * as React from 'react'
// import useDarkMode from 'use-dark-mode'
import {motion} from 'framer-motion'

const PodcastPlayer = ({episodeId}: {episodeId: string}) => {
  // const darkMode = useDarkMode()
  const [state, setState] = React.useState({loading: true})
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null)
  React.useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = `https://player.simplecast.com/${episodeId}?dark=true&color=162238`
    }
    iframeRef.current?.addEventListener('load', () =>
      setState({loading: false}),
    )
    return () => {
      iframeRef.current?.removeEventListener('load', () =>
        setState({loading: false}),
      )
    }
  }, [])
  return (
    <div className="relative my-8 overflow-hidden rounded-sm">
      {state.loading && (
        <motion.div
          animate={{
            opacity: [0.1, 1, 0.1],
          }}
          transition={{duration: 2, repeat: Infinity, repeatType: 'loop'}}
          className="absolute top-0 w-full overflow-hidden rounded-sm bg-[#222f44]"
          style={{height: 200}}
        >
          <motion.div
            className="absolute h-full w-40 rounded-full bg-[#384357]"
            animate={{left: ['0%', '100%']}}
            transition={{duration: 2, repeat: Infinity, repeatType: 'loop'}}
            style={{filter: 'blur(80px)'}}
          />
        </motion.div>
      )}

      <iframe
        ref={iframeRef}
        height="200px"
        width="100%"
        seamless
        // src={`https://player.simplecast.com/${episodeId}?dark=${
        //   darkMode.value ? true : false
        // }&color=${darkMode.value ? '162238' : 'FFFFFF'}`}
      />
    </div>
  )
}

export default PodcastPlayer