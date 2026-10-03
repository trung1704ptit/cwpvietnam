import * as migration_20260920_135759 from './20260920_135759';
import * as migration_20260920_141938_footer_and_settings_content from './20260920_141938_footer_and_settings_content';
import * as migration_20260926_025242_add_carousel_block from './20260926_025242_add_carousel_block';
import * as migration_20260926_031233_add_carousel_background_video from './20260926_031233_add_carousel_background_video';
import * as migration_20260926_031404_add_carousel_slide_duration from './20260926_031404_add_carousel_slide_duration';
import * as migration_20260926_083100_add_media_object_key from './20260926_083100_add_media_object_key';
import * as migration_20260926_091226_remove_media_image_sizes from './20260926_091226_remove_media_image_sizes';
import * as migration_20260926_093156_add_settings_home_page from './20260926_093156_add_settings_home_page';
import * as migration_20260926_094327_carousel_text_rich_text from './20260926_094327_carousel_text_rich_text';
import * as migration_20260926_102948_add_team_members from './20260926_102948_add_team_members';
import * as migration_20261001_140147_add_home_partners_feature_block from './20261001_140147_add_home_partners_feature_block';
import * as migration_20261001_141714_home_partners_image_aspect_options from './20261001_141714_home_partners_image_aspect_options';
import * as migration_20261001_151320_feature_block_icon from './20261001_151320_feature_block_icon';
import * as migration_20261003_022650_feature_block_max_width from './20261003_022650_feature_block_max_width';
import * as migration_20261003_023017_feature_block_media_size_default from './20261003_023017_feature_block_media_size_default';
import * as migration_20261003_024024_settings_typography from './20261003_024024_settings_typography';
import * as migration_20261003_024100_hero_type_default_high_impact from './20261003_024100_hero_type_default_high_impact';
import * as migration_20261003_030436_contact_block from './20261003_030436_contact_block';
import * as migration_20261003_035202_carousel_mobile_height from './20261003_035202_carousel_mobile_height';

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
    name: '20260926_093156_add_settings_home_page',
  },
  {
    up: migration_20260926_094327_carousel_text_rich_text.up,
    down: migration_20260926_094327_carousel_text_rich_text.down,
    name: '20260926_094327_carousel_text_rich_text',
  },
  {
    up: migration_20260926_102948_add_team_members.up,
    down: migration_20260926_102948_add_team_members.down,
    name: '20260926_102948_add_team_members',
  },
  {
    up: migration_20261001_140147_add_home_partners_feature_block.up,
    down: migration_20261001_140147_add_home_partners_feature_block.down,
    name: '20261001_140147_add_home_partners_feature_block',
  },
  {
    up: migration_20261001_141714_home_partners_image_aspect_options.up,
    down: migration_20261001_141714_home_partners_image_aspect_options.down,
    name: '20261001_141714_home_partners_image_aspect_options',
  },
  {
    up: migration_20261001_151320_feature_block_icon.up,
    down: migration_20261001_151320_feature_block_icon.down,
    name: '20261001_151320_feature_block_icon',
  },
  {
    up: migration_20261003_022650_feature_block_max_width.up,
    down: migration_20261003_022650_feature_block_max_width.down,
    name: '20261003_022650_feature_block_max_width',
  },
  {
    up: migration_20261003_023017_feature_block_media_size_default.up,
    down: migration_20261003_023017_feature_block_media_size_default.down,
    name: '20261003_023017_feature_block_media_size_default',
  },
  {
    up: migration_20261003_024024_settings_typography.up,
    down: migration_20261003_024024_settings_typography.down,
    name: '20261003_024024_settings_typography',
  },
  {
    up: migration_20261003_024100_hero_type_default_high_impact.up,
    down: migration_20261003_024100_hero_type_default_high_impact.down,
    name: '20261003_024100_hero_type_default_high_impact',
  },
  {
    up: migration_20261003_030436_contact_block.up,
    down: migration_20261003_030436_contact_block.down,
    name: '20261003_030436_contact_block',
  },
  {
    up: migration_20261003_035202_carousel_mobile_height.up,
    down: migration_20261003_035202_carousel_mobile_height.down,
    name: '20261003_035202_carousel_mobile_height'
  },
];
