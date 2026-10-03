import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * English became the default (unprefixed) site locale. Content that so far only existed in one
 * locale is copied into the other, for every localized-field table (`*_locales`, including
 * versions), so both `/...` and `/vi/...` render it and editors can translate it in place.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
      t record;
      cols text;
      pair text[];
    BEGIN
      FOR t IN
        SELECT c.table_name, c.udt_name
        FROM information_schema.columns c
        WHERE c.table_schema = 'public'
          AND c.column_name = '_locale'
          AND c.table_name LIKE '%\\_locales'
          AND EXISTS (
            SELECT 1 FROM information_schema.columns p
            WHERE p.table_schema = 'public' AND p.table_name = c.table_name AND p.column_name = '_parent_id'
          )
      LOOP
        SELECT string_agg(quote_ident(column_name), ', ' ORDER BY ordinal_position) INTO cols
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = t.table_name AND column_name NOT IN ('id', '_locale');

        FOREACH pair SLICE 1 IN ARRAY ARRAY[ARRAY['vi', 'en'], ARRAY['en', 'vi']] LOOP
          EXECUTE format(
            'INSERT INTO %1$I (%2$s, _locale)
             SELECT %2$s, %4$L::%5$I FROM %1$I s
             WHERE s._locale = %3$L::%5$I
               AND NOT EXISTS (SELECT 1 FROM %1$I d WHERE d._parent_id = s._parent_id AND d._locale = %4$L::%5$I)
             ON CONFLICT DO NOTHING',
            t.table_name, cols, pair[1], pair[2], t.udt_name
          );
        END LOOP;
      END LOOP;
    END $$;
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Copied rows are indistinguishable from content edited afterwards, so they are kept.
}
