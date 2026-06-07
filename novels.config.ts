export type Novel = {
  id: string
  title: string
  author: string
  description: string
  genre: string[]
  coverImage: string | null
  totalChapters: number
  contentFolder: string
  type: 'md'
}

const novels: Novel[] = [
  {
    id: 'lord-of-mysteries',
    title: 'Lord of the Mysteries',
    author: 'Cuttlefish That Loves Diving',
    description: 'A modern man is transmigrated into a Victorian-era world of steam and Cthulhu mythos, where he must navigate secret societies, ancient gods, and the mysteries of the Tarot Club.',
    genre: ['Mystery', 'Fantasy', 'Horror'],
    coverImage: '/covers/Klein moretti.jpg',
    totalChapters: 1400,
    contentFolder: 'lord-of-mysteries',
    type: 'md',
  },
]

export default novels
export function getNovel(id: string): Novel | undefined {
  return novels.find(n => n.id === id)
}
