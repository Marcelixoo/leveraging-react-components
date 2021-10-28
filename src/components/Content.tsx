import { useEffect, useState } from 'react';
import { MovieCard } from './MovieCard';
import { api } from '../services/api';
import '../styles//content.scss';

interface GenreResponseProps {
  id: number;
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface ContentProps {
  selectedGenreId: number;
}

export function Content(props: ContentProps) {
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  const populateSelectedGenreProps = () => {
    api.get<GenreResponseProps>(`genres/${props.selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }
  const loadMoviesByGenreId = () => {
    api.get<MovieProps[]>(`movies/?Genre_id=${props.selectedGenreId}`)
      .then(response => setMovies(response.data));
  }

  useEffect(() => {
    loadMoviesByGenreId();
    populateSelectedGenreProps();
  }, [props.selectedGenreId]);

  return (
    <div className="container">
      <header>
        <span className="category">Categoria:<span> {selectedGenre.title}</span></span>
      </header>

      <main>
        <div className="movies-list">
          {movies.map(movie => (
            <MovieCard
              key={movie.imdbID}
              title={movie.Title}
              poster={movie.Poster}
              runtime={movie.Runtime}
              rating={movie.Ratings[0].Value}
            />
          ))}
        </div>
      </main>
    </div>
  )
}