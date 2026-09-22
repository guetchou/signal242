import { useCallback, useEffect, useMemo, useState } from 'react';
import { useServices } from '@/app/providers/ServicesProvider';
import type { ReportQuery } from '@/domain/ports';
import type { Report, ReportStatus } from '@/domain/report/types';

export interface QueryState extends ReportQuery {}

/**
 * Chargement et rafraîchissement du corpus de signalements.
 *
 * Gère explicitement les trois états — chargement, erreur, vide — afin que
 * l'interface n'ait jamais à les improviser. Les mutations optimistes
 * remplacent l'élément en place plutôt que de recharger toute la liste.
 */
export function useReportsQuery(initial: QueryState = {}) {
  const { reports: repository } = useServices();
  const [query, setQuery] = useState<QueryState>(initial);
  const [items, setItems] = useState<readonly Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    repository
      .list(query)
      .then((result) => {
        if (!cancelled) setItems(result);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setError(cause instanceof Error ? cause.message : 'Chargement impossible.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [repository, query]);

  const replace = useCallback((updated: Report) => {
    setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  }, []);

  const updateStatus = useCallback(
    async (id: string, status: ReportStatus, note?: string) => {
      replace(await repository.updateStatus(id, status, note));
    },
    [replace, repository],
  );

  const patchQuery = useCallback((patch: Partial<QueryState>) => {
    setQuery((current) => ({ ...current, ...patch }));
  }, []);

  const isFiltered = useMemo(
    () =>
      Boolean(
        query.search ||
          query.categoryIds?.length ||
          query.statuses?.length ||
          query.severities?.length ||
          query.districts?.length,
      ),
    [query],
  );

  return { items, loading, error, query, patchQuery, resetQuery: () => setQuery({}), isFiltered, updateStatus };
}
