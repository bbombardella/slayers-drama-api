import { Prisma, PrismaClient } from '@prisma/client';
import { Genre } from '../src/tmdb-api/models';

const prisma = new PrismaClient();

const genres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Aventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comédie' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentaire' },
  { id: 18, name: 'Drame' },
  { id: 10751, name: 'Familial' },
  { id: 14, name: 'Fantastique' },
  { id: 36, name: 'Histoire' },
  { id: 27, name: 'Horreur' },
  { id: 10402, name: 'Musique' },
  { id: 9648, name: 'Mystère' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science-Fiction' },
  { id: 10770, name: 'Téléfilm' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'Guerre' },
  { id: 37, name: 'Western' },
];

const products: Prisma.ProductCreateManyInput[] = [
  {
    name: 'Billet plein tarif',
    price: 11,
  },
  {
    name: 'Billet -26 ans / Etudiant',
    price: 8,
  },
  {
    name: 'Billet enfant (-12 ans)',
    price: 6,
  },
];

const cinemas: Prisma.CinemaCreateManyInput[] = [
  {
    name: 'Lyon - Centre',
    city: 'Lyon',
  },
  {
    name: 'Lyon - Vaise',
    city: 'Lyon',
  },
  {
    name: 'St Etienne - Gare',
    city: 'St Etienne',
  },
];

async function main() {
  const batchGenrePayload = await prisma.genre.createMany({
    data: genres.map((g) => ({
      title: g.name,
      tmdbId: g.id,
    })),
    skipDuplicates: true,
  });

  console.log(`${batchGenrePayload.count} genre(s) added`);

  const batchCinemaPayload = await prisma.cinema.createMany({
    data: cinemas,
    skipDuplicates: true,
  });

  console.log(`${batchCinemaPayload.count} cinema(s) added`);

  const batchProductPayload = await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  console.log(`${batchProductPayload.count} price(s) added`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
