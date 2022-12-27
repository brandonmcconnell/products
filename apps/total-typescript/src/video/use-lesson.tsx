import {LessonResource} from 'lib/lesson-resources'
import React from 'react'
import {SanityDocument} from '@sanity/client'

type LessonContextType = {
  lesson: LessonResource
  section?: SanityDocument
  module: SanityDocument
}

export const LessonContext = React.createContext({} as LessonContextType)

type LessonProviderProps = {
  lesson: LessonResource
  module: SanityDocument
  section?: SanityDocument
  children: React.ReactNode
}

export const LessonProvider: React.FC<LessonProviderProps> = ({
  lesson,
  module,
  section,
  children,
}) => {
  const context = {
    lesson,
    module,
    section,
  }
  return (
    <LessonContext.Provider value={context}>{children}</LessonContext.Provider>
  )
}

export const useLesson = () => {
  const videoResourceContext = React.useContext(LessonContext)
  return videoResourceContext
}