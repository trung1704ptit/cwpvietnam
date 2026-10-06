import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const TABLES = [
  'pages_blocks_project_phases_phases_locales',
  '_pages_v_blocks_project_phases_phases_locales',
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    const t = sql.raw(`"${table}"`)
    // Postgres can't cast text to jsonb in place, and each line becomes its own Lexical paragraph.
    await db.execute(sql`
      ALTER TABLE ${t} ADD COLUMN "description_rich" jsonb;

      UPDATE ${t} SET "description_rich" = jsonb_build_object(
        'root', jsonb_build_object(
          'type', 'root', 'format', '', 'indent', 0, 'version', 1, 'direction', 'ltr',
          'children', (
            SELECT jsonb_agg(
              jsonb_build_object(
                'type', 'paragraph', 'format', '', 'indent', 0, 'version', 1,
                'direction', 'ltr', 'textFormat', 0, 'textStyle', '',
                'children', CASE WHEN btrim(line) = '' THEN '[]'::jsonb ELSE jsonb_build_array(
                  jsonb_build_object(
                    'type', 'text', 'text', line, 'format', 0, 'style', '',
                    'mode', 'normal', 'detail', 0, 'version', 1
                  )
                ) END
              ) ORDER BY ord
            )
            FROM unnest(
              string_to_array(btrim(replace("description", E'\r', ''), E' \n\t'), E'\n')
            ) WITH ORDINALITY AS lines(line, ord)
          )
        )
      )
      WHERE btrim(coalesce("description", ''), E' \n\r\t') <> '';

      ALTER TABLE ${t} DROP COLUMN "description";
      ALTER TABLE ${t} RENAME COLUMN "description_rich" TO "description";
    `)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of TABLES) {
    const t = sql.raw(`"${table}"`)
    await db.execute(sql`
      ALTER TABLE ${t} ADD COLUMN "description_text" varchar;

      UPDATE ${t} SET "description_text" = (
        SELECT string_agg(node #>> '{}', ' ')
        FROM jsonb_path_query("description", 'strict $.**.text') AS node
      )
      WHERE "description" IS NOT NULL;

      ALTER TABLE ${t} DROP COLUMN "description";
      ALTER TABLE ${t} RENAME COLUMN "description_text" TO "description";
    `)
  }
}
