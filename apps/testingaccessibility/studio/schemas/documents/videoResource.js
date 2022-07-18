export default {
  title: 'Video Resource',
  name: 'videoResource',
  type: 'document',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Description',
      name: 'description',
      type: 'body',
    },
    {
      title: 'Media URL',
      name: 'mediaUrl',
      type: 'url',
    },
    {
      title: 'SRT File',
      name: 'srtFile',
      type: 'file',
    },
    {
      title: 'Transcript',
      name: 'transcript',
      type: 'mediaCaption',
    },
  ],
}
