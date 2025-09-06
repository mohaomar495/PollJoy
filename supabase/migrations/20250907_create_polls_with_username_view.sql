CREATE OR REPLACE VIEW polls_with_username AS
SELECT
  p.*,
  pr.username
FROM
  polls p
LEFT JOIN
  profiles pr ON p.user_id = pr.id;

GRANT SELECT ON polls_with_username TO anon, authenticated;
