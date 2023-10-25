import { Prisma, PrismaClient } from '@prisma/client';
import { Genre, MovieDetails } from '../src/tmdb-api/models';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

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
    populate_movies().then(() => {
      console.log('populate done');
      populateScreenings().then(() => {
        console.log('populate screenings done');
      });
    });
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// region movies

const DELAY_BETWEEN_REQUESTS_MS = 251; // Délai d'une seconde (1000 millisecondes) entre les requêtes

async function populate_movies() {
  const start = 1;
  const end = 1000;
  console.log('populate start', start);
  console.log('populate end', end);

  let list = Array.from(
    { length: end - start },
    (_, i) => start + 1 + i
  )


  await Promise.all(list.map(async (id, index) => {
    let throttling = DELAY_BETWEEN_REQUESTS_MS * (index + 1);

    if (index > 0) {
      console.log(`throttling request ${id} from ${throttling}ms`);

      await new Promise(resolve => setTimeout(resolve, throttling));
    }

    try {
      let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`;
      let rrrr = await (await fetch(url)).json();

      const movieTmdb = (rrrr as unknown as MovieDetails);
      cloudinary.config({
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        cloud_name: process.env.CLOUDINARY_NAME,
      });
      const image = await cloudinary.uploader.upload(
        `${process.env.TMDB_URL_IMAGE_BASE}/${movieTmdb.poster_path}`
      );

      let date: undefined | Date = undefined;

      try {
        date = new Date(movieTmdb.release_date);
      } catch (e) {
        console.log('error', e);
      }

      const newMovie = await prisma.movie.create({
        data: {
          title: movieTmdb.title,
          releaseDate: date,
          overview: movieTmdb.overview,
          popularity: movieTmdb.popularity,
          voteAverage: movieTmdb.vote_average,
          budget: movieTmdb.budget,
          tagline: movieTmdb.tagline,
          tmdbId: movieTmdb.id,
          updatedAt: new Date(),
          duration: movieTmdb.runtime,
          genres: {
            connectOrCreate: movieTmdb.genres.map((g) => ({
              where: {
                tmdbId: g.id,
              },
              create: {
                title: g.name,
                tmdbId: g.id,
                updatedAt: new Date(),
              },
            })),
          },
          poster: {
            create: {
              url: image.url,
              cloudinaryPublicId: image.public_id,
            },
          },
        },
      });
      console.log(`\tsuccess ${id} : ${newMovie.title}`);
    } catch (e) {
      console.log(`\terror ${id} : ${e.message}`);
    }

  }));

  console.log('populate/');
}
// endregion movies

//region séances

async function populateScreenings() {
  let cinemas = await prisma.cinema.findMany();
  let movies = (await prisma.movie.findMany()).sort(() => Math.random() - 0.5);

  let moviesSelected = movies.splice(0, 20);

  for (let m of moviesSelected) {
    for (let c of cinemas) {
      let d = dateUtil();
      await prisma.screening.create({
        data: {
          start: d[0],
          end: d[1],
          cinemaId: (c.id as number) ?? 1,
          movieId: (m.id as number) ?? 1,
          initialAvailableSeats: 100,
        }
      });
    }
  }

  function dateUtil(): Date[] {
    // Date actuelle
    const now = new Date();

    // Date dans une semaine
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Date aléatoire entre maintenant et une semaine plus tard
    const randomDate = new Date(now.getTime() + Math.random() * (oneWeekLater.getTime() - now.getTime()));

    // Définition des heures de début et de fin (8h et 21h)
    const startHour = 8;
    const endHour = 21;

    // Générer la première date aléatoire entre 8h et 21h
    randomDate.setHours(startHour + Math.random() * (endHour - startHour));

    // Générer la deuxième date en ajoutant 1 heure 30 minutes
    const interval = 90 * 60 * 1000; // 1 heure 30 minutes en millisecondes
    const secondRandomDate = new Date(randomDate.getTime() + interval);

    return [randomDate, secondRandomDate];
  }
}

//endregion séances