import { ArrowRight, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { journeys, lessons, sources, topics } from '../../data/content';
import './index.css';

const matches = (value: string, query: string) => value.toLowerCase().includes(query.trim().toLowerCase());

export default function Explore() {
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const filteredTopics = useMemo(
    () => topics.filter((topic) => !query || matches(topic.name, query)),
    [query],
  );
  const filteredSources = useMemo(
    () => sources.filter((source) => !query || matches(source, query)),
    [query],
  );
  const filteredJourneys = useMemo(
    () => journeys.filter((journey) => !query || matches(`${journey.title} ${journey.description}`, query)),
    [query],
  );
  const filteredLessons = useMemo(
    () => lessons.filter((lesson) => {
      const matchesQuery = !query || matches(
        `${lesson.title} ${lesson.source} ${lesson.description} ${lesson.topic}`, query,
      );
      const matchesTopic = !selectedTopic || lesson.topic === selectedTopic;
      const matchesSource = !selectedSource || lesson.source.toLowerCase().includes(selectedSource.toLowerCase());
      return matchesQuery && matchesTopic && matchesSource;
    }),
    [query, selectedTopic, selectedSource],
  );

  const clearFilters = () => {
    setQuery('');
    setSelectedTopic(null);
    setSelectedSource(null);
  };
  const hasFilters = Boolean(query || selectedTopic || selectedSource);

  return (
    <div className="page">
      <div className="page-heading">
        <span className="eyebrow">Explore at your own pace</span>
        <h1>Wisdom Library</h1>
        <p>Discover researched teachings, practical exercises and guided learning journeys.</p>
      </div>

      <label className="search-box surface">
        <Search size={19} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search teachings, concepts, sources or journeys..."
          aria-label="Search the wisdom library"
        />
        {query && (
          <button className="icon-button search-clear" type="button" onClick={() => setQuery('')} aria-label="Clear search">
            <X size={17} />
          </button>
        )}
      </label>

      <div className="section-title">
        <h2>Explore by topic</h2>
        <span className="muted">{filteredTopics.length} topics</span>
      </div>
      <div className="topic-grid">
        {filteredTopics.map((topic, index) => (
          <button
            className={`topic-card surface ${selectedTopic === topic.name ? 'is-selected' : ''}`}
            key={topic.name}
            type="button"
            aria-pressed={selectedTopic === topic.name}
            onClick={() => setSelectedTopic((current) => current === topic.name ? null : topic.name)}
          >
            <span className={`topic-art topic-art--${index % 4}`} aria-hidden="true">{['✿', '☼', '◈', '❧'][index % 4]}</span>
            <strong>{topic.name}</strong>
            <small>{selectedTopic === topic.name ? 'Selected · show matching lessons' : 'View related lessons'}</small>
          </button>
        ))}
        {filteredTopics.length === 0 && <p className="empty-state">No topics match this search.</p>}
      </div>

      <div className="section-title">
        <h2>Explore by source</h2>
      </div>
      <div className="source-grid">
        {filteredSources.map((source, index) => (
          <button
            className={`source-card surface ${selectedSource === source ? 'is-selected' : ''}`}
            key={source}
            type="button"
            aria-pressed={selectedSource === source}
            onClick={() => setSelectedSource((current) => current === source ? null : source)}
          >
            <span aria-hidden="true">{['❖', '❧', '◉', '✥'][index]}</span>
            {source}
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        ))}
        {filteredSources.length === 0 && <p className="empty-state">No sources match this search.</p>}
      </div>

      <div className="section-title">
        <h2>Available lessons</h2>
        <span className="muted">{filteredLessons.length} lessons</span>
      </div>
      <div className="library-results">
        {filteredLessons.map((lesson) => (
          <Link to={`/lesson/${lesson.id}`} className="library-lesson surface" key={lesson.id}>
            <span className="library-lesson__art" aria-hidden="true">✿</span>
            <span className="library-lesson__copy">
              <small>{lesson.source} · {lesson.minutes} min</small>
              <strong>{lesson.title}</strong>
              <span>{lesson.description}</span>
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        ))}
        {filteredLessons.length === 0 && (
          <div className="empty-state surface">
            <strong>No lessons found for these filters yet.</strong>
            <p>The library currently has one complete sample lesson. Try another topic or source.</p>
            {hasFilters && <button className="btn btn-secondary" type="button" onClick={clearFilters}>Clear filters</button>}
          </div>
        )}
      </div>

      <div className="section-title">
        <h2>Guided learning journeys</h2>
        {hasFilters && (
          <button className="text-link explore-all" type="button" onClick={clearFilters}>
            Clear filters <X size={14} />
          </button>
        )}
      </div>
      <div className="journey-grid">
        {filteredJourneys.map((journey, index) => (
          <article className="journey-card surface" key={journey.id}>
            <div className={`journey-card__art journey-card__art--${index}`} aria-hidden="true" />
            <div>
              <span className="eyebrow">{journey.lessons} lessons · ~{journey.totalMinutes} minutes</span>
              <h3>{journey.title}</h3>
              <p>{journey.description}</p>
              <Link className="text-link journey-open" to={`/journey/${journey.id}`}>Explore this journey <ArrowRight size={14} /></Link>
            </div>
          </article>
        ))}
        {filteredJourneys.length === 0 && <p className="empty-state">No available journeys match this search.</p>}
      </div>
    </div>
  );
}
