import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT || 3000);
const comicBanner = 'comic';
const genres = ['slice of life', 'crime', 'horror', 'adventure', 'comedy', 'isekai', 'sci fi', 'thriller'];
const stories = ['romantic', 'mystery', 'just fucking around', 'action', 'a day in life', 'catastrophe', 'FOIL piece', 'exploring'];
const secondRoles = {
  romantic: 'love interest 1',
  mystery: 'mystery holder NPC',
  'just fucking around': 'NPC',
  action: 'antagonist',
  catastrophe: 'victim',
  'FOIL piece': 'rival protagonist',
  exploring: 'NPC'
};

app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json());

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createStory() {
  return { genre: randomItem(genres), story: randomItem(stories) };
}

function roleForCast(story, cast) {
  if (cast.length === 0) return 'protagonist';
  if (cast.length === 1) return secondRoles[story] || 'NPC';
  return 'NPC';
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.get('/api/comic/story', async (_request, response, next) => {
  try {
    const story = await prisma.comicStory.findUnique({ where: { banner: comicBanner } });
    response.json(story || { banner: comicBanner, cast: [] });
  } catch (error) {
    next(error);
  }
});

app.post('/api/comic/roll', async (request, response, next) => {
  const character = typeof request.body?.character === 'string' ? request.body.character.trim() : '';
  if (!character) {
    response.status(400).json({ error: 'character is required' });
    return;
  }

  try {
    const result = await prisma.$transaction(async transaction => {
      let story = await transaction.comicStory.findUnique({ where: { banner: comicBanner } });
      if (!story) {
        const setup = createStory();
        story = await transaction.comicStory.create({
          data: { banner: comicBanner, ...setup, cast: [] }
        });
      }

      const cast = Array.isArray(story.cast) ? story.cast : [];
      const existing = cast.find(member => member.character === character);
      if (existing) return { story, role: existing.role };

      const role = roleForCast(story.story, cast);
      const updatedCast = [...cast, { character, role }];
      const updatedStory = await transaction.comicStory.update({
        where: { banner: comicBanner },
        data: { cast: updatedCast }
      });
      return { story: updatedStory, role };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 5000, timeout: 10000 });

    response.json({
      banner: result.story.banner,
      genre: result.story.genre,
      story: result.story.story,
      role: result.role,
      cast: result.story.cast
    });
  } catch (error) {
    if (error.code === 'P2034') {
      response.status(409).json({ error: 'A roll happened at the same time. Please retry.' });
      return;
    }
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(port, () => {
  console.log(`Comic banner API listening on port ${port}`);
});

async function shutdown() {
  server.close();
  await prisma.$disconnect();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
