import groq from 'groq'
import {VideoResource, VideoResourceSchema} from '../schemas/video-resource'
import {sanityClient} from '../utils/sanity-client'

export const getVideoResource = async (id: string): Promise<VideoResource> => {
  const videoResource = await sanityClient.fetch(
    groq`*[_type in ['videoResource'] && _id == $id][0]{
      _id,
      "transcript": castingwords.transcript,
      "muxPlaybackId": muxAsset.muxPlaybackId
    }`,
    {id},
  )

  return VideoResourceSchema.parse(videoResource)
}
