import prisma from "../lib/prismadb";

const main = async () => {
  try {
    const author = await prisma.author.create({
      data: {
        name: "Jack Kornfield",
        website: "https://jackkornfield.com/",
        bio: "Jack Kornfield trained as a Buddhist monk in the monasteries of Thailand, India and Burma. He has taught meditation internationally since 1974 and is one of the key teachers to introduce Buddhist mindfulness practice to the West. After graduating from Dartmouth College in Asian Studies in 1967 he joined the Peace Corps and worked on tropical medicine teams in the Mekong River valley. He met and studied as a monk under the Buddhist master Ven. Ajahn Chah, as well as the Ven. Mahasi Sayadaw of Burma. Returning to the United States, Jack co-founded the Insight Meditation Society in Barre, Massachusetts, with fellow meditation teachers Sharon Salzberg and Joseph Goldstein and the Spirit Rock Center in Woodacre, California. Over the years, Jack has taught in centers and universities worldwide, led International Buddhist Teacher meetings, and worked with many of the great teachers of our time. He holds a Ph.D. in clinical psychology and is a father, husband and activist. His books have been translated into 20 languages and sold more than a million copies. They include, A Wise Heart: A Guide to the Universal Teachings of Buddhist Psychology, A Path with Heart; After the Ecstasy, the Laundry; Teachings of the Buddha; Seeking the Heart of Wisdom; Living Dharma; A Still Forest Pool; Stories of the Spirit, Stories of the Heart; Buddha’s Little Instruction Book; The Art of Forgiveness, Lovingkindness and Peace, Bringing Home the Dharma: Awakening Right Where You Are, and his most recent book, No Time Like the Present: Finding Freedom, Love, and Joy Right Where You Are",
        image:
          "https://jackkornfield.com/wp-content/uploads/2014/01/Jack-Kornfield_201blkwht_DeborahJaffe.jpg",
        works: {
          //@ts-ignore
          create: {
            title: "Heart Wisdom",
            sections: ["Episode 167 - The Perfection of Truthfulness"],
            medium: "PODCAST",
            externalUrl: "https://jackkornfield.com/podcasts-heart-wisdom/",
          },
        },
      },
    });
    console.log({ author });
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
