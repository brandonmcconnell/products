import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'

export const AuthorSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  name: z.string(),
  bio: z.string(),
  links: z
    .object({
      url: z.string(),
      label: z.string(),
    })
    .array()
    .nullable(),
  twitterHandle: z.string(),
  picture: z
    .object({
      url: z.string(),
      alt: z.string(),
    })
    .nullable(),
  slug: z.string(),
})

export const EventSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  author: AuthorSchema.nullable(),
  description: z.nullable(z.string()).optional(),
  body: z.nullable(z.string()).optional(),
  state: z.enum(['published', 'draft']),
  timezone: z.nullable(z.string().url()).optional(),
  image: z
    .object({
      width: z.number(),
      height: z.number(),
      secure_url: z.string(),
    })
    .partial()
    .optional()
    .nullable(),
  ogImage: z
    .object({
      secure_url: z.string(),
    })
    .partial()
    .optional()
    .nullable(),
})

export const EventsSchema = z.array(EventSchema)

export type Event = z.infer<typeof EventSchema>

export const getAllEvents = async (): Promise<Event[]> => {
  const events =
    await sanityClient.fetch(groq`*[_type == "event"] | order(startsAt desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        author-> {
          _id,
          _type,
          _updatedAt,
          _createdAt,
          name,
          bio,
          links[]{
            url, label
          },
          twitterHandle,
          picture {
              "url": asset->url,
              alt
          },
          "slug": slug.current
        },
        title,
        state,
        "slug": slug.current,
        startsAt,
        endsAt,
        description,
        timezone,
        body,
        image,
        ogImage,
  }`)

  return EventsSchema.parse(events)
}

export const getEvent = async (slug: string): Promise<Event> => {
  const event = await sanityClient.fetch(
    groq`*[_type == "event" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        author-> {
          _id,
          _type,
          _updatedAt,
          _createdAt,
          name,
          bio,
          links[]{
            url, label
          },
          twitterHandle,
          picture {
              "url": asset->url,
              alt
          },
          "slug": slug.current
        },
        title,
        state,
        "slug": slug.current,
        startsAt,
        endsAt,
        description,
        timezone,
        body,
        image,
        ogImage,
    }`,
    {slug: `${slug}`},
  )

  return EventSchema.parse(event)
}
