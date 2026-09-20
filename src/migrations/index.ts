import * as migration_20260920_135759 from './20260920_135759';
import * as migration_20260920_141938_footer_and_settings_content from './20260920_141938_footer_and_settings_content';

export const migrations = [
  {
    up: migration_20260920_135759.up,
    down: migration_20260920_135759.down,
    name: '20260920_135759',
  },
  {
    up: migration_20260920_141938_footer_and_settings_content.up,
    down: migration_20260920_141938_footer_and_settings_content.down,
    name: '20260920_141938_footer_and_settings_content'
  },
];
