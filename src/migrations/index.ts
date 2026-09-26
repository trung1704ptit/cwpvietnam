import * as migration_20260920_135759 from './20260920_135759';
import * as migration_20260920_141938_footer_and_settings_content from './20260920_141938_footer_and_settings_content';
import * as migration_20260926_025242_add_carousel_block from './20260926_025242_add_carousel_block';
import * as migration_20260926_031233_add_carousel_background_video from './20260926_031233_add_carousel_background_video';
import * as migration_20260926_031404_add_carousel_slide_duration from './20260926_031404_add_carousel_slide_duration';
import * as migration_20260926_083100_add_media_object_key from './20260926_083100_add_media_object_key';
import * as migration_20260926_091226_remove_media_image_sizes from './20260926_091226_remove_media_image_sizes';
import * as migration_20260926_093156_add_settings_home_page from './20260926_093156_add_settings_home_page';

export const migrations = [
  {
    up: migration_20260920_135759.up,
    down: migration_20260920_135759.down,
    name: '20260920_135759',
  },
  {
    up: migration_20260920_141938_footer_and_settings_content.up,
    down: migration_20260920_141938_footer_and_settings_content.down,
    name: '20260920_141938_footer_and_settings_content',
  },
  {
    up: migration_20260926_025242_add_carousel_block.up,
    down: migration_20260926_025242_add_carousel_block.down,
    name: '20260926_025242_add_carousel_block',
  },
  {
    up: migration_20260926_031233_add_carousel_background_video.up,
    down: migration_20260926_031233_add_carousel_background_video.down,
    name: '20260926_031233_add_carousel_background_video',
  },
  {
    up: migration_20260926_031404_add_carousel_slide_duration.up,
    down: migration_20260926_031404_add_carousel_slide_duration.down,
    name: '20260926_031404_add_carousel_slide_duration',
  },
  {
    up: migration_20260926_083100_add_media_object_key.up,
    down: migration_20260926_083100_add_media_object_key.down,
    name: '20260926_083100_add_media_object_key',
  },
  {
    up: migration_20260926_091226_remove_media_image_sizes.up,
    down: migration_20260926_091226_remove_media_image_sizes.down,
    name: '20260926_091226_remove_media_image_sizes',
  },
  {
    up: migration_20260926_093156_add_settings_home_page.up,
    down: migration_20260926_093156_add_settings_home_page.down,
    name: '20260926_093156_add_settings_home_page'
  },
];
