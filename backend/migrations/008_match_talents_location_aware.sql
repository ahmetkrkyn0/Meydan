-- Konum + müsaitlik destekli yetenek eşleştirme.
--
-- Eski imzayı düşürüp threshold 0.80, count 3 ve iki opsiyonel parametre
-- (filter_city, availability) ile yeniden tanımlar.
--
-- availability = 'local'  -> aynı şehirdeki taraftarlar
-- availability = 'online' -> şehir filtresi yok
-- availability NULL       -> şehir filtresi yok (geriye dönük)

DROP FUNCTION IF EXISTS match_talents(vector, float, int);
DROP FUNCTION IF EXISTS match_talents(vector, float, int, text, text);

CREATE OR REPLACE FUNCTION match_talents(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.80,
  match_count int DEFAULT 3,
  filter_city text DEFAULT NULL,
  availability text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  full_name text,
  city text,
  offered_talent text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.full_name,
    p.city,
    p.offered_talent,
    1 - (p.talent_embedding <=> query_embedding) AS similarity
  FROM profiles p
  WHERE
    p.role = 'taraftar'
    AND p.talent_embedding IS NOT NULL
    AND (1 - (p.talent_embedding <=> query_embedding)) >= match_threshold
    AND (
      availability IS NULL
      OR availability <> 'local'
      OR filter_city IS NULL
      OR p.city = filter_city
    )
  ORDER BY p.talent_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
