-- Yetenek eşleşmesine kategori filtresi.
--
-- Sebep: Vector benzerliği "sporcuya hizmet veren profesyonel" kategorisini
-- birbirine yakın görüyor (fotoğrafçı ihtiyacına fizyoterapist %80 ile
-- eşleşiyordu). Çözüm: SQL tarafında talent_needed kelimesinin offered_talent
-- içinde geçmesini ZORUNLU kıl. Vector skorlamayı yapsın, filtreyi yapmasın.

DROP FUNCTION IF EXISTS match_talents(vector, float, int, text, text);
DROP FUNCTION IF EXISTS match_talents(vector, float, int, text, text, text);

CREATE OR REPLACE FUNCTION match_talents(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.80,
  match_count int DEFAULT 3,
  filter_city text DEFAULT NULL,
  availability text DEFAULT NULL,
  required_talent text DEFAULT NULL
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
    AND (
      required_talent IS NULL
      OR required_talent = ''
      OR p.offered_talent ILIKE '%' || required_talent || '%'
    )
  ORDER BY p.talent_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
