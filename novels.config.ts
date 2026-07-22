export type Novel = {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string[];
  coverImage: string | null;
  totalChapters: number;
  contentFolder: string;
  type: "md";
};

const novels: Novel[] = [
  {
    id: "lord-of-mysteries",
    title: "Lord of the Mysteries",
    author: "Cuttlefish That Loves Diving",
    description:
      "A modern man is transmigrated into a Victorian-era world of steam and Cthulhu mythos, where he must navigate secret societies, ancient gods, and the mysteries of the Tarot Club.",
    genre: ["Mystery", "Fantasy", "Horror"],
    coverImage: "/covers/Klein moretti.jpg",
    totalChapters: 1400,
    contentFolder: "lord-of-mysteries",
    type: "md",
  },
  {
    id: "Slime",
    title: "Tensei Shitara Slime Datta Ken",
    author: "Fuse",
    description:
      "A man is stabbed by a robber on the run after pushing his coworker and his coworker’s new fiance out of the way. As he lays dying, bleeding on the ground, he hears a voice. This voice is strange and interprets his dying regret of being a virgin by giving him the [Great Sage] unique skill! Is he being made fun of ?!",
    genre: ["Comedy", "Fantasy", "Action", "Adventure", "Shounen"],
    coverImage: "/covers/slime.jpg",
    totalChapters: 413,
    contentFolder: "slime",
    type: "md",
  },
  {
    id: "Omniscient Reader’s Viewpoint",
    title: "Omniscient Reader’s Viewpoint",
    author: "Sing-Shong, 싱숑",
    description:
      "Only I know the end of this world.One day our MC finds himself stuck in the world of his favorite webnovel. What does he do to survive? It is a world struck by catastrophe and danger all around.His edge? He knows the plot of the story to end. Because he was the sole reader that stuck with it. Read his story to see how he survives!",
    genre: ["Action, Adventure, Drama, Fantasy, Psychological"],
    coverImage: "/covers/Kim.jpg",
    totalChapters: 551,
    contentFolder: "omniscient",
    type: "md",
  },
];

export default novels;
export function getNovel(id: string): Novel | undefined {
  return novels.find((n) => n.id === id);
}
